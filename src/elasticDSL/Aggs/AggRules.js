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
import { getAggsDateRangeITC } from './Bucket/DateRange';
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

import { getAvgBucketITC } from './Pipeline/AvgBucket';
import { getBucketScriptITC } from './Pipeline/BucketScript';
import { getBucketSelectorITC } from './Pipeline/BucketSelector';
import { getCumulativeSumITC } from './Pipeline/CumulativeSum';
import { getDerivativeITC } from './Pipeline/Derivative';
import { getExtendedStatsBucketITC } from './Pipeline/ExtendedStatsBucket';
import { getMaxBucketITC } from './Pipeline/MaxBucket';
import { getMinBucketITC } from './Pipeline/MinBucket';
import { getMovingAverageITC } from './Pipeline/MovingAverage';
import { getPercentilesBucketITC } from './Pipeline/PercentilesBucket';
import { getSerialDifferencingITC } from './Pipeline/SerialDifferencing';
import { getStatsBucketITC } from './Pipeline/StatsBucket';
import { getSumBucketITC } from './Pipeline/SumBucket';

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
        date_range: () => getAggsDateRangeITC(opts),
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

        avg_bucket: () => getAvgBucketITC(opts),
        bucket_script: () => getBucketScriptITC(opts),
        bucket_selector: () => getBucketSelectorITC(opts),
        cumulative_sum: () => getCumulativeSumITC(opts),
        derivative: () => getDerivativeITC(opts),
        extended_stats_bucket: () => getExtendedStatsBucketITC(opts),
        max_bucket: () => getMaxBucketITC(opts),
        min_bucket: () => getMinBucketITC(opts),
        moving_average: () => getMovingAverageITC(opts),
        percentiles_bucket: () => getPercentilesBucketITC(opts),
        serial_differencing: () => getSerialDifferencingITC(opts),
        stats_bucket: () => getStatsBucketITC(opts),
        sum_bucket: () => getSumBucketITC(opts),

        aggs: {
          type: () => [getAggBlockITC(opts)],
          description: 'Aggregation block',
        },
      },
    })
  );
}
