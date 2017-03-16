/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';
import { getAggBlockITC } from './AggBlock';

import { getAvgITC } from './Metrics/Avg';
import { getCardinalityITC } from './Metrics/Cardinality';
import { getExtendedStatsITC } from './Metrics/ExtendedStats';
import { getGeoBoundsITC } from './Metrics/GeoBounds';
import { getGeoCentroidITC } from './Metrics/GeoCentroid';
import { getMaxITC } from './Metrics/Max';
import { getMinITC } from './Metrics/Min';
import { getPercentileRanksITC } from './Metrics/PercentileRanks';
import { getPercentilesITC } from './Metrics/Percentiles';
import { getScriptedMetricITC } from './Metrics/ScriptedMetric';
import { getStatsITC } from './Metrics/Stats';
import { getSumITC } from './Metrics/Sum';
import { getTopHitsITC } from './Metrics/TopHits';
import { getValueCountITC } from './Metrics/ValueCount';

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
        geo_bounds: () => getGeoBoundsITC(opts),
        geo_centroid: () => getGeoCentroidITC(opts),
        max: () => getMaxITC(opts),
        min: () => getMinITC(opts),
        percentile_ranks: () => getPercentileRanksITC(opts),
        percentiles: () => getPercentilesITC(opts),
        scripted_metric: () => getScriptedMetricITC(opts),
        stats: () => getStatsITC(opts),
        sum: () => getSumITC(opts),
        top_hits: () => getTopHitsITC(opts),
        value_count: () => getValueCountITC(opts),

        aggs: {
          type: () => [getAggBlockITC(opts)],
          description: 'Aggregation block',
        },
      },
    }));
}
