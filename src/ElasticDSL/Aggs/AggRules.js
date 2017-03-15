/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';
import { getAggBlockITC } from './AggBlock';

import { getAvgITC } from './Metrics/Avg';
import { getCardinalityITC } from './Metrics/Cardinality';
import { getExtendedStatsITC } from './Metrics/ExtendedStats';

export function getAggRulesITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggRules', opts);
  const description = desc(
    `
    The aggregations framework helps provide aggregated data based on
    a search query. It is based on simple building blocks called aggregations,
    that can be composed in order to build complex summaries of the data.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        avg: () => getAvgITC(opts),
        cardinality: () => getCardinalityITC(opts),
        extended_stats: () => getExtendedStatsITC(opts),

        aggs: {
          type: () => [getAggBlockITC(opts)],
          description: 'Aggregation block',
        },
      },
    }));
}
