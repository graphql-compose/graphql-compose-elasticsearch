/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getMinBucketITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsMinBucket', opts);
  const description = desc(
    `
    A sibling pipeline aggregation which identifies the bucket(s) with
    the minimum value of a specified metric in a sibling aggregation and
    outputs both the value and the key(s) of the bucket(s). The specified
    metric must be numeric and the sibling aggregation must be a multi-bucket
    aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-min-bucket-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      buckets_path: 'String!',
      gap_policy: 'String',
      format: 'String',
    },
  }));
}
