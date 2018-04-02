/* @flow */
/* eslint-disable no-param-reassign */

import { Resolver, TypeComposer, InputTypeComposer, isObject } from 'graphql-compose';
import type { ResolveParams, ProjectionType } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getSearchBodyITC, prepareBodyInResolve } from '../elasticDSL/SearchBody';
import { getSearchOutputTC } from '../types/SearchOutput';

export type ElasticSearchResolverOpts = {
  prefix?: ?string,
  elasticIndex: string,
  elasticType: string,
  elasticClient: Object,
};

export default function createFindByIdResolver(
  fieldMap: FieldsMapByElasticType,
  sourceTC: TypeComposer,
  opts: ElasticSearchResolverOpts
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

  const searchITC = getSearchBodyITC({ prefix, fieldMap }).removeField([
    'size',
    'from',
    '_source',
    'explain',
    'version',
  ]);

  const findByIdFC = parser.generateFieldConfig('findById', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  const argsConfigMap = Object.assign({}, findByIdFC.args, {
    body: {
      type: searchITC.getType(),
    },
  });

  delete argsConfigMap.index; // index can not be changed, it hardcoded in findByIdFC
  delete argsConfigMap.type; // type can not be changed, it hardcoded in findByIdFC
  delete argsConfigMap.explain; // added automatically if requested _shard, _node, _explanation
  delete argsConfigMap.version; // added automatically if requested _version
  delete argsConfigMap._source; // added automatically due projection
  delete argsConfigMap._sourceExclude; // added automatically due projection
  delete argsConfigMap._sourceInclude; // added automatically due projection
  delete argsConfigMap.trackScores; // added automatically due projection (is _scrore requested with sort)

  delete argsConfigMap.size;
  delete argsConfigMap.from;

  argsConfigMap._id = 'String'; // id of record in index

  const topLevelArgs = ['_id'];

  argsConfigMap.opts = InputTypeComposer.create({
    name: `${sourceTC.getTypeName()}Opts`,
    fields: Object.assign({}, argsConfigMap),
  }).removeField(topLevelArgs);

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
      if (!args.body) args.body = {};

      const { hits = {} } = projection;

      if (hits && typeof hits === 'object') {
        // Turn on explain if in projection requested this fields:
        if (hits._shard || hits._node || hits._explanation) {
          args.body.explain = true;
        }

        if (hits._version) {
          args.body.version = true;
        }

        if (!hits._source) {
          args.body._source = false;
        } else {
          args.body._source = toDottedList(hits._source);
        }

        if (hits._score) {
          args.body.track_scores = true;
        }
      }

      if (args._id) {
        args.body._id = args._id;
        delete args._id;
      }

      if (args.body) {
        args.body = prepareBodyInResolve(args.body, fieldMap);
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
