/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getAvgBucketITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsAvgBucket', opts);
  const description = desc(
    `
    A sibling pipeline aggregation which calculates the (mean) average value
    of a specified metric in a sibling aggregation. The specified metric must
    be numeric and the sibling aggregation must be a multi-bucket aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-avg-bucket-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        buckets_path: 'String!',
        gap_policy: 'String',
        format: 'String',
      },
    })
  );
}
