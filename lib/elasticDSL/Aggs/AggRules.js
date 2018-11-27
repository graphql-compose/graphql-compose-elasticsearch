"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggRulesITC = getAggRulesITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

var _AggBlock = require("./AggBlock");

var _Avg = require("./Metrics/Avg");

var _Cardinality = require("./Metrics/Cardinality");

var _ExtendedStats = require("./Metrics/ExtendedStats");

var _GeoBounds = require("./Metrics/GeoBounds");

var _GeoCentroid = require("./Metrics/GeoCentroid");

var _Max = require("./Metrics/Max");

var _Min = require("./Metrics/Min");

var _PercentileRanks = require("./Metrics/PercentileRanks");

var _Percentiles = require("./Metrics/Percentiles");

var _ScriptedMetric = require("./Metrics/ScriptedMetric");

var _Stats = require("./Metrics/Stats");

var _Sum = require("./Metrics/Sum");

var _TopHits = require("./Metrics/TopHits");

var _ValueCount = require("./Metrics/ValueCount");

var _Children = require("./Bucket/Children");

var _DateHistogram = require("./Bucket/DateHistogram");

var _DateRange = require("./Bucket/DateRange");

var _DiversifiedSampler = require("./Bucket/DiversifiedSampler");

var _Filter = require("./Bucket/Filter");

var _Filters = require("./Bucket/Filters");

var _GeoDistance = require("./Bucket/GeoDistance");

var _GeohashGrid = require("./Bucket/GeohashGrid");

var _Global = require("./Bucket/Global");

var _Histogram = require("./Bucket/Histogram");

var _IpRange = require("./Bucket/IpRange");

var _Missing = require("./Bucket/Missing");

var _Nested = require("./Bucket/Nested");

var _Range = require("./Bucket/Range");

var _ReverseNested = require("./Bucket/ReverseNested");

var _Sampler = require("./Bucket/Sampler");

var _SignificantTerms = require("./Bucket/SignificantTerms");

var _Terms = require("./Bucket/Terms");

var _AvgBucket = require("./Pipeline/AvgBucket");

var _BucketScript = require("./Pipeline/BucketScript");

var _BucketSelector = require("./Pipeline/BucketSelector");

var _CumulativeSum = require("./Pipeline/CumulativeSum");

var _Derivative = require("./Pipeline/Derivative");

var _ExtendedStatsBucket = require("./Pipeline/ExtendedStatsBucket");

var _MaxBucket = require("./Pipeline/MaxBucket");

var _MinBucket = require("./Pipeline/MinBucket");

var _MovingAverage = require("./Pipeline/MovingAverage");

var _PercentilesBucket = require("./Pipeline/PercentilesBucket");

var _SerialDifferencing = require("./Pipeline/SerialDifferencing");

var _StatsBucket = require("./Pipeline/StatsBucket");

var _SumBucket = require("./Pipeline/SumBucket");

function getAggRulesITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggRules', opts);
  const description = (0, _utils.desc)(`
    The aggregations framework helps provide aggregated data based on
    a search query. It is based on simple building blocks called aggregations,
    that can be composed in order to build complex summaries of the data.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      avg: () => (0, _Avg.getAvgITC)(opts),
      cardinality: () => (0, _Cardinality.getCardinalityITC)(opts),
      extended_stats: () => (0, _ExtendedStats.getExtendedStatsITC)(opts),
      geo_bounds: () => (0, _GeoBounds.getGeoBoundsITC)(opts),
      geo_centroid: () => (0, _GeoCentroid.getGeoCentroidITC)(opts),
      max: () => (0, _Max.getMaxITC)(opts),
      min: () => (0, _Min.getMinITC)(opts),
      percentile_ranks: () => (0, _PercentileRanks.getPercentileRanksITC)(opts),
      percentiles: () => (0, _Percentiles.getPercentilesITC)(opts),
      scripted_metric: () => (0, _ScriptedMetric.getScriptedMetricITC)(opts),
      stats: () => (0, _Stats.getStatsITC)(opts),
      sum: () => (0, _Sum.getSumITC)(opts),
      top_hits: () => (0, _TopHits.getTopHitsITC)(opts),
      value_count: () => (0, _ValueCount.getValueCountITC)(opts),
      children: () => (0, _Children.getChildrenITC)(opts),
      date_histogram: () => (0, _DateHistogram.getDateHistogramITC)(opts),
      date_range: () => (0, _DateRange.getAggsDateRangeITC)(opts),
      diversified_sampler: () => (0, _DiversifiedSampler.getDiversifiedSamplerITC)(opts),
      filter: () => (0, _Filter.getFilterITC)(opts),
      filters: () => (0, _Filters.getFiltersITC)(opts),
      geo_distance: () => (0, _GeoDistance.getGeoDistanceITC)(opts),
      geohash_grid: () => (0, _GeohashGrid.getGeohashGridITC)(opts),
      global: () => (0, _Global.getGlobalITC)(opts),
      histogram: () => (0, _Histogram.getHistogramITC)(opts),
      ip_range: () => (0, _IpRange.getIpRangeITC)(opts),
      missing: () => (0, _Missing.getMissingITC)(opts),
      nested: () => (0, _Nested.getNestedITC)(opts),
      range: () => (0, _Range.getRangeITC)(opts),
      reverse_nested: () => (0, _ReverseNested.getReverseNestedITC)(opts),
      sampler: () => (0, _Sampler.getSamplerITC)(opts),
      significant_terms: () => (0, _SignificantTerms.getSignificantTermsITC)(opts),
      terms: () => (0, _Terms.getTermsITC)(opts),
      avg_bucket: () => (0, _AvgBucket.getAvgBucketITC)(opts),
      bucket_script: () => (0, _BucketScript.getBucketScriptITC)(opts),
      bucket_selector: () => (0, _BucketSelector.getBucketSelectorITC)(opts),
      cumulative_sum: () => (0, _CumulativeSum.getCumulativeSumITC)(opts),
      derivative: () => (0, _Derivative.getDerivativeITC)(opts),
      extended_stats_bucket: () => (0, _ExtendedStatsBucket.getExtendedStatsBucketITC)(opts),
      max_bucket: () => (0, _MaxBucket.getMaxBucketITC)(opts),
      min_bucket: () => (0, _MinBucket.getMinBucketITC)(opts),
      moving_average: () => (0, _MovingAverage.getMovingAverageITC)(opts),
      percentiles_bucket: () => (0, _PercentilesBucket.getPercentilesBucketITC)(opts),
      serial_differencing: () => (0, _SerialDifferencing.getSerialDifferencingITC)(opts),
      stats_bucket: () => (0, _StatsBucket.getStatsBucketITC)(opts),
      sum_bucket: () => (0, _SumBucket.getSumBucketITC)(opts),
      aggs: {
        type: () => [(0, _AggBlock.getAggBlockITC)(opts)],
        description: 'Aggregation block'
      }
    }
  }));
}