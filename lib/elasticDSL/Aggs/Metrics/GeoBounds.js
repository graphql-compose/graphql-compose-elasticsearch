"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoBoundsITC = getGeoBoundsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getGeoBoundsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsGeoBounds', opts);
  const description = (0, _utils.desc)(`
    A metric aggregation that computes the bounding box containing
    all geo_point values for a field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geobounds-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getGeoPointFields)(opts),
      wrap_longitude: 'Boolean'
    }
  }));
}