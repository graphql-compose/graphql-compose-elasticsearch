/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getMaxBucketITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsMaxBucket', opts);
  const description = desc(
    `
    A sibling pipeline aggregation which identifies the bucket(s) with
    the maximum value of a specified metric in a sibling aggregation and
    outputs both the value and the key(s) of the bucket(s). The specified
    metric must be numeric and the sibling aggregation must be a multi-bucket
    aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-max-bucket-aggregation.html)
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
