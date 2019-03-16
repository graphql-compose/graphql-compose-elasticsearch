/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getStatsBucketITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsStatsBucket', opts);
  const description = desc(
    `
    A sibling pipeline aggregation which calculates a variety of stats across
    all bucket of a specified metric in a sibling aggregation. The specified
    metric must be numeric and the sibling aggregation must be a multi-bucket
    aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-stats-bucket-aggregation.html)
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
