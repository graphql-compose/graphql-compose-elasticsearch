import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getBucketSelectorITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsBucketSelector', opts);
  const description = desc(
    `
    A parent pipeline aggregation which executes a script which determines
    whether the current bucket will be retained in the parent multi-bucket
    aggregation. The specified metric must be numeric and the script must
    return a boolean value. If the script language is expression then a numeric
    return value is permitted. In this case 0.0 will be evaluated as false
    and all other values will evaluate to true.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-selector-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      buckets_path: 'JSON!',
      script: 'String!',
      gap_policy: 'String',
    },
  }));
}
