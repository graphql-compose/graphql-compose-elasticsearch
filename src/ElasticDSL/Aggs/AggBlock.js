/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';
import { getAggRulesITC } from './AggRules';

export function getAggBlockITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggBlock', opts);
  const description = desc(`
    The aggregations framework helps provide aggregated data based on
    a search query. It is based on simple building blocks called aggregations,
    that can be composed in order to build complex summaries of the data.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)
  `);

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        key: {
          type: 'String',
          description: 'FieldName in response for aggregation result',
        },
        value: {
          type: () => getAggRulesITC(opts),
          description: 'Aggregation rules',
        },
      },
    })
  );
}
