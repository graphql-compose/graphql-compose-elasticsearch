/* eslint-disable no-param-reassign */

import { Resolver, isObject, ObjectTypeComposer } from 'graphql-compose';
import type { ResolverResolveParams, ProjectionType } from 'graphql-compose';
import ElasticApiParser from '../ElasticApiParser';
import { getSearchBodyITC, prepareBodyInResolve } from '../elasticDSL/SearchBody';
import { getSearchOutputTC } from '../types/SearchOutput';
import type { CommonOpts } from '../utils';

export default function createSearchResolver<TSource, TContext>(
  opts: CommonOpts<TContext>
): Resolver<TSource, TContext> {
  const { fieldMap, sourceTC, schemaComposer } = opts;

  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'opts.fieldMap for Resolver search() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!(sourceTC instanceof ObjectTypeComposer)) {
    throw new Error(
      'opts.sourceTC for Resolver search() should be instance of ObjectTypeComposer.'
    );
  }

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix: opts.prefix,
  });

  const searchITC = getSearchBodyITC(opts).removeField([
    'size',
    'from',
    '_source',
    'explain',
    'version',
  ]);

  const searchFC = parser.generateFieldConfig('search', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  const argsConfigMap = {
    ...searchFC.args,
    body: {
      type: searchITC,
    },
  } as Record<string, any>;

  delete argsConfigMap.index; // index can not be changed, it hardcoded in searchFC
  delete argsConfigMap.type; // type can not be changed, it hardcoded in searchFC
  delete argsConfigMap.explain; // added automatically if requested _shard, _node, _explanation
  delete argsConfigMap.version; // added automatically if requested _version
  delete argsConfigMap._source; // added automatically due projection
  delete argsConfigMap._sourceExclude; // added automatically due projection
  delete argsConfigMap._sourceInclude; // added automatically due projection
  delete argsConfigMap.trackScores; // added automatically due projection (is _score requested with sort)

  delete argsConfigMap.size;
  delete argsConfigMap.from;
  argsConfigMap.limit = 'Int';
  argsConfigMap.skip = 'Int';

  argsConfigMap.query = searchITC.getField('query');
  argsConfigMap.aggs = searchITC.getField('aggs');
  argsConfigMap.sort = searchITC.getField('sort');
  argsConfigMap.highlight = searchITC.getField('highlight');

  const topLevelArgs = ['q', 'query', 'sort', 'limit', 'skip', 'aggs', 'highlight', 'opts'];
  argsConfigMap.opts = schemaComposer
    .createInputTC({
      name: `${sourceTC.getTypeName()}Opts`,
      fields: { ...argsConfigMap },
    })
    .removeField(topLevelArgs);
  Object.keys(argsConfigMap).forEach((argKey) => {
    if (topLevelArgs.indexOf(argKey) === -1) {
      // $FlowFixMe
      delete argsConfigMap[argKey];
    }
  });

  const type = getSearchOutputTC(opts);
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
      hits: hitsType ? ([hitsType] as any) : 'JSON',
    })
    .reorderFields(['hits', 'count', 'aggregations', 'max_score', 'took', 'timed_out', '_shards']);

  return schemaComposer
    .createResolver({
      type,
      name: 'search',
      kind: 'query',
      args: argsConfigMap,
      resolve: async (rp: ResolverResolveParams<any, any>) => {
        let args = rp.args || ({} as Record<string, any>);
        const projection = rp.projection || {};
        if (!args.body) args.body = {};

        if ({}.hasOwnProperty.call(args, 'limit')) {
          args.size = args.limit;
          delete args.limit;
        }

        if ({}.hasOwnProperty.call(args, 'skip')) {
          args.from = args.skip;
          delete args.skip;
        }

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

        if (args.query) {
          args.body.query = args.query;
          delete args.query;
        }

        if (args.aggs) {
          args.body.aggs = args.aggs;
          delete args.aggs;
        }

        if (args.highlight) {
          args.body.highlight = args.highlight;
          delete args.highlight;
        }

        if (args.sort) {
          args.body.sort = args.sort;
          delete args.sort;
        }

        if (args.opts) {
          args = {
            ...args.opts,
            ...args,
            body: { ...args.opts.body, ...args.body },
          };
          delete args.opts;
        }

        if (args.body) {
          args.body = prepareBodyInResolve(args.body, fieldMap);
        }

        const res: any = await searchFC.resolve(rp.source, args, rp.context, rp.info);
        if (typeof res.hits === "undefined") {
          res.count =
            typeof res.body.hits.total?.value === 'number' ? res.body.hits.total.value : res.body.hits.total;
          res.max_score = res.body.hits.max_score;
          res.hits = res.body.hits.hits;
        }
        else {
          res.count =
            typeof res.hits.total?.value === 'number' ? res.hits.total.value : res.hits.total;
          res.max_score = res.hits.max_score;
          res.hits = res.hits.hits;
        }
        return res;
      },
    })
    .reorderArgs(['q', 'query', 'sort', 'limit', 'skip', 'aggs']);
}

export function toDottedList(projection: ProjectionType, prev?: string[]): string[] | boolean {
  let result = [] as string[];
  Object.keys(projection).forEach((k) => {
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
