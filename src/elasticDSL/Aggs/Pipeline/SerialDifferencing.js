/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getSerialDifferencingITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsSerialDifferencing', opts);
  const description = desc(
    `
    Serial differencing is a technique where values in a time series are
    subtracted from itself at different time lags or periods.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-serialdiff-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      buckets_path: 'String!',
      lag: 'String',
      gap_policy: 'String',
      format: 'String',
    },
  }));
}
