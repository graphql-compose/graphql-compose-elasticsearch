/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';
import { getNumericFields } from '../../Commons/FieldNames';

export function getExtendedStatsITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsExtendedStats', opts);
  const description = desc(
    `
    A multi-value metrics aggregation that computes stats over numeric values
    extracted from the aggregated documents. These values can be extracted
    either from specific numeric fields in the documents, or be generated
    by a provided script.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-extendedstats-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: getNumericFields(opts),
        sigma: 'Float',
        missing: 'Float',
        script: () => getCommonsScriptITC(opts),
      },
    })
  );
}
