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

import { getChildrenITC } from './Bucket/Children';
import { getDateHistogramITC } from './Bucket/DateHistogram';
import { getDateRangeITC } from './Bucket/DateRange';
import { getDiversifiedSamplerITC } from './Bucket/DiversifiedSampler';
import { getFilterITC } from './Bucket/Filter';
import { getFiltersITC } from './Bucket/Filters';
import { getGeoDistanceITC } from './Bucket/GeoDistance';
import { getGeohashGridITC } from './Bucket/GeohashGrid';
import { getGlobalITC } from './Bucket/Global';
import { getHistogramITC } from './Bucket/Histogram';
import { getIpRangeITC } from './Bucket/IpRange';
import { getMissingITC } from './Bucket/Missing';
import { getNestedITC } from './Bucket/Nested';
import { getRangeITC } from './Bucket/Range';
import { getReverseNestedITC } from './Bucket/ReverseNested';
import { getSamplerITC } from './Bucket/Sampler';
import { getSignificantTermsITC } from './Bucket/SignificantTerms';
import { getTermsITC } from './Bucket/Terms';

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

        children: () => getChildrenITC(opts),
        date_histogram: () => getDateHistogramITC(opts),
        date_range: () => getDateRangeITC(opts),
        diversified_sampler: () => getDiversifiedSamplerITC(opts),
        filter: () => getFilterITC(opts),
        filters: () => getFiltersITC(opts),
        geo_distance: () => getGeoDistanceITC(opts),
        geohash_grid: () => getGeohashGridITC(opts),
        global: () => getGlobalITC(opts),
        histogram: () => getHistogramITC(opts),
        ip_range: () => getIpRangeITC(opts),
        missing: () => getMissingITC(opts),
        nested: () => getNestedITC(opts),
        range: () => getRangeITC(opts),
        reverse_nested: () => getReverseNestedITC(opts),
        sampler: () => getSamplerITC(opts),
        significant_terms: () => getSignificantTermsITC(opts),
        terms: () => getTermsITC(opts),

        aggs: {
          type: () => [getAggBlockITC(opts)],
          description: 'Aggregation block',
        },
      },
    }));
}
