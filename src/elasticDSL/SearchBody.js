/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC, prepareQueryInResolve } from './Query/Query';
import { getAggsITC, prepareAggsInResolve } from './Aggs/Aggs';
import { getSortITC } from './Sort';
import { getTypeName, type CommonOpts, desc } from '../utils';

export function getSearchBodyITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('SearchBody', opts);
  const description = desc(
    `
    Request Body Search
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      query: { type: () => getQueryITC(opts) },
      aggs: { type: () => getAggsITC(opts) },
      size: 'Int',
      from: 'Int',
      sort: { type: () => [getSortITC(opts)] },
      _source: 'JSON',
      script_fields: 'JSON',
      post_filter: () => getQueryITC(opts),
      highlight: 'JSON',
      search_after: 'JSON',

      explain: 'Boolean',
      version: 'Boolean',
      indices_boost: 'JSON',
      min_score: 'Float',

      search_type: 'String',
      rescore: 'JSON',
      docvalue_fields: '[String]',
      stored_fields: '[String]',
    },
  }));
}

export function prepareBodyInResolve(body: any, fieldMap: mixed): { [argName: string]: any } {
  /* eslint-disable no-param-reassign */
  if (body.query) {
    body.query = prepareQueryInResolve(body.query, fieldMap);
  }
  if (body.aggs) {
    body.aggs = prepareAggsInResolve(body.aggs, fieldMap);
  }
  return body;
}
