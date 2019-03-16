/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getPercentilesBucketITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsPercentilesBucket', opts);
  const description = desc(
    `
    A sibling pipeline aggregation which calculates percentiles across all
    bucket of a specified metric in a sibling aggregation. The specified metric
    must be numeric and the sibling aggregation must be a multi-bucket aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-percentiles-bucket-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      buckets_path: 'String!',
      gap_policy: 'String',
      format: 'String',
      percents: '[Float]',
    },
  }));
}
