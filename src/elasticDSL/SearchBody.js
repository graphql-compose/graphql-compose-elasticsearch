/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import { getQueryITC, prepareQueryInResolve } from './Query/Query';
import { getAggsITC, prepareAggsInResolve } from './Aggs/Aggs';
import { getSortITC } from './Sort';
import { getTypeName, getOrSetType, desc } from '../utils';

export type SearchOptsT = {
  prefix?: string,
  postfix?: string,
  fieldMap?: FieldsMapByElasticType,
};

export function getSearchBodyITC(opts: SearchOptsT = {}): InputTypeComposer {
  const name = getTypeName('SearchBody', opts);
  const description = desc(
    `
    Request Body Search
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        query: () => getQueryITC(opts),
        aggs: () => getAggsITC(opts),
        size: 'Int',
        from: 'Int',
        sort: () => [getSortITC(opts)],
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

export function prepareBodyInResolve(
  body: any,
  fieldMap: mixed
): { [argName: string]: any } {
  /* eslint-disable no-param-reassign */
  if (body.query) {
    body.query = prepareQueryInResolve(body.query, fieldMap);
  }
  if (body.aggs) {
    body.aggs = prepareAggsInResolve(body.aggs, fieldMap);
  }
  return body;
}
