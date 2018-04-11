/* @flow */
/* eslint-disable no-param-reassign */

import { Resolver, TypeComposer, isObject } from 'graphql-compose';
import type { ResolveParams, ProjectionType } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getFindByIdOutputTC } from '../types/FindByIdOutput';

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
    _source: true,
  });

  const argsConfigMap = Object.assign({}, findByIdFC.args);

  const topLevelArgs = ['id'];

  Object.keys(argsConfigMap).forEach(argKey => {
    if (topLevelArgs.indexOf(argKey) === -1) {
      delete argsConfigMap[argKey];
    }
  });

  const type = getFindByIdOutputTC({ prefix, fieldMap, sourceTC });

  return new Resolver({
    type,
    name: 'findById',
    kind: 'query',
    args: argsConfigMap,
    resolve: async (rp: ResolveParams<*, *>) => {
      // const projection = rp.projection || {};
      const res = await findByIdFC.resolve(rp.source, rp.args, rp.context, rp.info);
      console.log(res);

      return {
        _index: opts.elasticIndex,
        _type: opts.elasticType,
        _id: rp.args.id,
        _version: 1,
        found: !!res,
        _source: res,
      };
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
