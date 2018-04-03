/* @flow */
/* eslint-disable no-param-reassign */

import { Resolver, TypeComposer, isObject } from 'graphql-compose';
import type { ResolveParams, ProjectionType } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getSearchOutputTC } from '../types/SearchOutput';

export type ElasticFindByIdResolverOpts = {
  prefix?: ?string,
  elasticIndex: string,
  elasticType: string,
  elasticClient: Object,
};

export default function createFindByIdResolver(
  fieldMap: FieldsMapByElasticType,
  sourceTC: TypeComposer,
  opts: ElasticFindByIdResolverOpts
): Resolver {
  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'First arg for Resolver findById() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver findById() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix,
  });

  const findByIdFC = parser.generateFieldConfig('getSource', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  const argsConfigMap = Object.assign({}, findByIdFC.args);

  const topLevelArgs = ['id'];

  Object.keys(argsConfigMap).forEach(argKey => {
    if (topLevelArgs.indexOf(argKey) === -1) {
      delete argsConfigMap[argKey];
    }
  });

  const type = getSearchOutputTC({ prefix, fieldMap, sourceTC });
  let hitsType;
  try {
    hitsType = type.get('hits.hits');
  } catch (e) {
    hitsType = 'JSON';
  }
  type
    .addFields({
      count: 'Int',
      max_score: 'Float',
      hits: hitsType ? [hitsType] : 'JSON',
    })
    .reorderFields(['hits', 'count', 'aggregations', 'max_score', 'took', 'timed_out', '_shards']);

  return new Resolver({
    type,
    name: 'findById',
    kind: 'query',
    args: argsConfigMap,
    resolve: async (rp: ResolveParams<*, *>) => {
      const args: Object = rp.args || {};
      const projection = rp.projection || {};
      const { hits = {} } = projection;

      if (hits && typeof hits === 'object') {
        if (hits._version) {
          args.version = true;
        }

        if (!hits._source) {
          args._source = false;
        } else {
          args._source = toDottedList(hits._source);
        }

        if (hits._realtime) {
          args.realtime = true;
        }

        if (hits._refresh) {
          args.refresh = true;
        }
      }

      const res: any = await findByIdFC.resolve(rp.source, args, rp.context, rp.info);

      res.count = res.hits.total;
      res.max_score = res.hits.max_score;
      res.hits = res.hits.hits;

      return res;
    },
  });
}

export function toDottedList(projection: ProjectionType, prev?: string[]): string[] | boolean {
  let result = [];
  Object.keys(projection).forEach(k => {
    if (isObject(projection[k])) {
      const tmp = toDottedList(projection[k], prev ? [...prev, k] : [k]);
      if (Array.isArray(tmp)) {
        result = result.concat(tmp);
        return;
      }
    }

    if (prev) {
      result.push([...prev, k].join('.'));
    } else {
      result.push(k);
    }
  });
  return result.length > 0 ? result : true;
}
