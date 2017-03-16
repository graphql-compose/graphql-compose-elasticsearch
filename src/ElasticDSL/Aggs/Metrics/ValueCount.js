/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';

export function getValueCountITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsValueCount', opts);
  const description = desc(
    `
    A single-value metrics aggregation that counts the number of values that
    are extracted from the aggregated documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-valuecount-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: 'String',
        script: () => getCommonsScriptITC(opts),
      },
    }));
}
