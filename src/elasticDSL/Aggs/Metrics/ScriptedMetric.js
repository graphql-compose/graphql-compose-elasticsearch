/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';

export function getScriptedMetricITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsScriptedMetric', opts);
  const description = desc(
    `
    A metric aggregation that executes using scripts to provide a metric output.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-scripted-metric-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    // $FlowFixMe
    fields: {
      init_script: () => getCommonsScriptITC(opts),
      map_script: () => getCommonsScriptITC(opts),
      combine_script: () => getCommonsScriptITC(opts),
      reduce_script: () => getCommonsScriptITC(opts),
      params: `input ${getTypeName('AggsScriptedMetricParams', opts)} {
          field: String
          _agg: JSON!
        }`,
    },
  }));
}
