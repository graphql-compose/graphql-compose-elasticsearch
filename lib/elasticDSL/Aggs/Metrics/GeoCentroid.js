"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoCentroidITC = getGeoCentroidITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getGeoCentroidITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsGeoCentroid', opts);
  const description = (0, _utils.desc)(`
    A metric aggregation that computes the weighted centroid from all coordinate
    values for a Geo-point datatype field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geocentroid-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getGeoPointFields)(opts)
    }
  }));
}