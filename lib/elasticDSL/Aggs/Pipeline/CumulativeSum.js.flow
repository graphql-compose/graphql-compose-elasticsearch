/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getCumulativeSumITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsCumulativeSum', opts);
  const description = desc(
    `
    A parent pipeline aggregation which calculates the cumulative sum of a
    specified metric in a parent histogram (or date_histogram) aggregation.
    The specified metric must be numeric and the enclosing histogram must
    have min_doc_count set to 0 (default for histogram aggregations).
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-cumulative-sum-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        buckets_path: 'String!',
        format: 'String',
      },
    })
  );
}
