/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getFiltersITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsFilters', opts);
  const description = desc(
    `
    Defines a multi bucket aggregation where each bucket is associated
    with a filter. Each bucket will collect all documents that match
    its associated filter.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      filters: 'JSON',
      other_bucket: 'Boolean',
      other_bucket_key: 'String',
    },
  }));
}
