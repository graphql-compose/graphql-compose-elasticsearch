/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getFiltersITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsFilters', opts);
  const description = desc(
    `
    Defines a multi bucket aggregation where each bucket is associated
    with a filter. Each bucket will collect all documents that match
    its associated filter.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        filters: 'JSON',
        other_bucket: 'Boolean',
        other_bucket_key: 'String',
      },
    })
  );
}
