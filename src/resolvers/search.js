/* @flow */
/* eslint-disable no-param-reassign */

import { Resolver, TypeComposer, isObject } from 'graphql-compose';
import type { ResolveParams, ProjectionType } from 'graphql-compose/lib/definition';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import type { ElasticApiVersion } from '../ElasticApiParser';
import {
  getSearchBodyITC,
  prepareBodyInResolve,
} from '../elasticDSL/SearchBody';
import { getSearchOutputTC } from '../types/SearchOutput';

export type ElasticSearchResolverOpts = {
  [name: string]: mixed,
  prefix?: string,
  elasticApiVersion?: ElasticApiVersion,
};

export default function createSearchResolver(
  fieldMap: FieldsMapByElasticType,
  sourceTC?: TypeComposer,
  elasticClient?: mixed,
  opts?: ElasticSearchResolverOpts = {}
): Resolver<*, *> {
  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'First arg for Resolver search() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!(sourceTC instanceof TypeComposer)) {
    throw new Error(
      'Second arg for Resolver search() should be instance of TypeComposer.'
    );
  }

  const prefix = opts.prefix || 'Es';

  const parser = new ElasticApiParser({
    elasticClient,
    version: opts.elasticApiVersion || '5_0',
    prefix,
  });
  const searchFC = parser.generateFieldConfig('search', {
    index: 'cv',
    type: 'cv',
  });

  const searchITC = getSearchBodyITC({
    prefix,
    fieldMap,
  });

  searchITC.removeField(['size', 'from', '_source', 'explain', 'version']);

  const argsConfigMap = Object.assign({}, searchFC.args, {
    body: {
      type: searchITC.getType(),
    },
  });

  delete argsConfigMap.index; // index can not be changed, it hardcoded in searchFC
  delete argsConfigMap.type; // type can not be changed, it hardcoded in searchFC
  delete argsConfigMap.explain; // added automatically if requested _shard, _node, _explanation
  delete argsConfigMap.version; // added automatically if requested _version
  delete argsConfigMap._source; // added automatically due projection
  delete argsConfigMap._sourceExclude; // added automatically due projection
  delete argsConfigMap._sourceInclude; // added automatically due projection

  delete argsConfigMap.size;
  delete argsConfigMap.from;
  argsConfigMap.limit = 'Int';
  argsConfigMap.skip = 'Int';

  const type = getSearchOutputTC({ prefix, fieldMap, sourceTC });
  // $FlowFixMe
  type.addFields({
    count: 'Int',
    max_score: 'Float',
  });

  // $FlowFixMe
  return new Resolver({
    type,
    name: 'search',
    kind: 'query',
    args: argsConfigMap,
    resolve: async (rp: ResolveParams<*, *>) => {
      const { args = {}, projection = {} } = rp;

      if (args.body) {
        args.body = prepareBodyInResolve(args.body, fieldMap);
      }

      if ({}.hasOwnProperty.call(args, 'limit')) {
        args.size = args.limit;
        delete args.limit;
      }

      if ({}.hasOwnProperty.call(args, 'skip')) {
        args.from = args.skip;
        delete args.skip;
      }

      const { hits = {} } = projection;
      // $FlowFixMe
      const { hits: hitsHits } = hits;

      if (typeof hitsHits === 'object') {
        // Turn on explain if in projection requested this fields:
        if (hitsHits._shard || hitsHits._node || hitsHits._explanation) {
          // $FlowFixMe
          args.body.explain = true;
        }

        if (hitsHits._version) {
          // $FlowFixMe
          args.body.version = true;
        }

        if (!hitsHits._source) {
          // $FlowFixMe
          args.body._source = false;
        } else {
          // $FlowFixMe
          args.body._source = toDottedList(hitsHits._source);
        }
      }

      // $FlowFixMe
      const res = await searchFC.resolve(rp.source, args, rp.context, rp.info);

      res.count = res.hits.total;
      res.max_score = res.hits.max_score;

      return res;
    },
  });
}

export function toDottedList(projection: ProjectionType, prev: string[]): string[] | boolean {
  let result = [];
  Object.keys(projection).forEach(k => {
    if (isObject(projection[k])) {
      // $FlowFixMe
      const tmp = toDottedList(projection[k], prev ? [ ...prev, k] : [k]);
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
