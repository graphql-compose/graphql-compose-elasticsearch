/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';
import { getAllFields } from '../../Commons/FieldNames';

export function getValueCountITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsValueCount', opts);
  const description = desc(
    `
    A single-value metrics aggregation that counts the number of values that
    are extracted from the aggregated documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-valuecount-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getAllFields(opts),
      script: (): InputTypeComposer<TContext> => getCommonsScriptITC(opts),
    },
  }));
}
