/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';
import { getNumericFields } from '../../Commons/FieldNames';

export function getSumITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsSum', opts);
  const description = desc(
    `
    A single-value metrics aggregation that sums up numeric values that are
    extracted from the aggregated documents. These values can be extracted
    either from specific numeric fields in the documents, or be generated
    by a provided script.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-sum-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getNumericFields(opts),
      missing: 'Float',
      script: (): InputTypeComposer<TContext> => getCommonsScriptITC(opts),
    },
  }));
}
