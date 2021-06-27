import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getBucketScriptITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsBucketScript', opts);
  const description = desc(
    `
    A parent pipeline aggregation which executes a script which can perform
    per bucket computations on specified metrics in the parent multi-bucket
    aggregation. The specified metric must be numeric and the script must
    return a numeric value.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-script-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      buckets_path: 'JSON!',
      script: 'String!',
      format: 'String',
      gap_policy: 'String',
    },
  }));
}
