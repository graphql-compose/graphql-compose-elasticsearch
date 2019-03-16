/* @flow */
/* eslint-disable no-unused-vars */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getQueryITC } from '../../Query/Query';

export function getFilterITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsFilter', opts);
  const description = desc(
    `
    Defines a single bucket of all the documents in the current document set
    context that match a specified filter. Often this will be used to narrow
    down the current aggregation context to a specific set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filter-aggregation.html)
  `
  );

  return getQueryITC(opts);
}
