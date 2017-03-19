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

  // if (!(tc instanceof TypeComposer)) {
  //   throw new Error(
  //     'Second arg for Resolver search() should be instance of TypeComposer.'
  //   );
  // }

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

  const args = Object.assign({}, searchFC.args, {
    body: {
      type: getSearchBodyITC({
        prefix,
        fieldMap,
      }).getType(),
    },
  });

  delete args.index; // index can not be changed, it hardcoded in searchFC
  delete args.type; // type can not be changed, it hardcoded in searchFC
  delete args.explain; // added automatically if requested _shard, _node, _explanation
  delete args.version; // added automatically if requested _version
  delete args._source; // added automatically due projection
  delete args._sourceExclude; // added automatically due projection
  delete args._sourceInclude; // added automatically due projection

  // $FlowFixMe
  return new Resolver({
    // $FlowFixMe
    type: sourceTC ? getSearchOutputTC({ prefix, fieldMap, sourceTC }) : 'JSON',
    name: 'search',
    kind: 'query',
    args,
    resolve: (rp: ResolveParams<*, *>) => {
      if (rp.args && rp.args.body) {
        rp.args.body = prepareBodyInResolve(rp.args.body, fieldMap);
      }

      const { projection = {} } = rp;
      const { hits = {} } = projection;
      // $FlowFixMe
      const { hits: hitsHits } = hits;

      if (typeof hitsHits === 'object') {
        // Turn on explain if in projection requested this fields:
        if (hitsHits._shard || hitsHits._node || hitsHits._explanation) {
          // $FlowFixMe
          rp.args.body.explain = true;
        }

        if (hitsHits._version) {
          // $FlowFixMe
          rp.args.body.version = true;
        }

        if (!hitsHits._source) {
          // $FlowFixMe
          rp.args.body._source = false;
        } else {
          // $FlowFixMe
          rp.args.body._source = toDottedList(hitsHits._source);
        }
      }

      // $FlowFixMe
      const res = searchFC.resolve(rp.source, rp.args, rp.context, rp.info);

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
