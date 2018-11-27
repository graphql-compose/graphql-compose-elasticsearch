"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoDistanceITC = getGeoDistanceITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Geo = require("../../Commons/Geo");

var _Float = require("../../Commons/Float");

var _FieldNames = require("../../Commons/FieldNames");

function getGeoDistanceITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsGeoDistance', opts);
  const description = (0, _utils.desc)(`
    A multi-bucket aggregation that works on geo_point fields. The user can
    define a point of origin and a set of distance range buckets.
    The aggregation evaluate the distance of each document value from the
    origin point and determines the buckets it belongs to based on the ranges
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geodistance-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getGeoPointFields)(opts),
      origin: (0, _Geo.getGeoPointFC)(opts),
      ranges: [(0, _Float.getFloatRangeITC)(opts)],
      unit: (0, _Geo.getDistanceUnitFC)(opts),
      distance_type: (0, _Geo.getDistanceCalculationModeFC)(opts)
    }
  }));
}