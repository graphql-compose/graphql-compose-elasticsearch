"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeohashGridITC = getGeohashGridITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getGeohashGridITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsGeohashGrid', opts);
  const description = (0, _utils.desc)(`
    A multi-bucket aggregation that works on geo_point fields and groups points
    into buckets that represent cells in a grid. Each cell is labeled using
    a geohash which is of user-definable precision. Geohashes can have a choice
    of precision between 1 and 12.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geohashgrid-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getGeoPointFields)(opts),
      precision: 'Int',
      size: {
        type: 'Int',
        defaultValue: 10000
      },
      shard_size: 'Int'
    }
  }));
}