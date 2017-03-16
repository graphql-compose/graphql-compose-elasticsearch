/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';

export function getSumITC(opts: mixed = {}): InputTypeComposer {
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

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: 'String',
        missing: 'Float',
        script: () => getCommonsScriptITC(opts),
      },
    }));
}
