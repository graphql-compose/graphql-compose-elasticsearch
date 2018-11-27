"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoPolygonITC = getGeoPolygonITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

var _Geo = require("../../Commons/Geo");

function getGeoPolygonITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryGeoPolygon', opts);
  const description = (0, _utils.desc)(`
    A query allowing to include hits that only fall within a polygon of points.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-polygon-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryGeoPolygonSettings', opts);
  const fields = (0, _FieldNames.getGeoPointAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      points: [(0, _Geo.getGeoPointFC)(opts)],
      validation_method: 'String'
    }
  })));

  if (typeof fields === 'object') {
    return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
      name,
      description,
      fields
    }));
  } // $FlowFixMe


  return {
    type: 'JSON',
    description
  };
}