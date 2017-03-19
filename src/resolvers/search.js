/* @flow */
/* eslint-disable no-param-reassign */

import { Resolver, TypeComposer } from 'graphql-compose';
import type { ResolveParams } from 'graphql-compose/lib/definition';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import type { ElasticApiVersion } from '../ElasticApiParser';
import {
  getSearchBodyITC,
  prepareBodyInResolve,
} from '../elasticDSL/SearchBody';

export type ElasticSearchResolverOpts = {
  [name: string]: mixed,
  prefix?: string,
  elasticApiVersion?: ElasticApiVersion,
};

export default function createSearchResolver(
  fieldMap: FieldsMapByElasticType,
  tc?: TypeComposer,
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

  const parser = new ElasticApiParser({
    elasticClient,
    version: opts.elasticApiVersion || '5_0',
    prefix: opts.prefix || 'Es',
  });
  const searchFC = parser.generateFieldConfig('search', {
    index: 'cv',
    type: 'cv',
  });

  const args = Object.assign({}, searchFC.args, {
    body: {
      type: getSearchBodyITC({
        prefix: opts.prefix,
        fieldMap,
      }).getType(),
    },
  });

  // $FlowFixMe
  return new Resolver({
    type: 'JSON', // [tc],
    name: 'search',
    kind: 'query',
    args,
    resolve: (rp: ResolveParams<*, *>) => {
      if (rp.args && rp.args.body) {
        rp.args.body = prepareBodyInResolve(rp.args.body, fieldMap);
      }
      // $FlowFixMe
      const res = searchFC.resolve(rp.source, rp.args, rp.context, rp.info);
      // console.log(res);
      return res;
    },
  });
}
