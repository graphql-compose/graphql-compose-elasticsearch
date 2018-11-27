"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoBoundingBoxITC = getGeoBoundingBoxITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

var _Geo = require("../../Commons/Geo");

function getGeoBoundingBoxITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryGeoBoundingBox', opts);
  const description = (0, _utils.desc)(`
    A query allowing to filter hits based on a point location using a bounding box.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryGeoBoundingBoxSettings', opts);
  const fields = (0, _FieldNames.getGeoPointAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      top_left: (0, _Geo.getGeoPointFC)(opts),
      bottom_right: (0, _Geo.getGeoPointFC)(opts)
    }
  })));

  if (typeof fields === 'object') {
    return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
      name,
      description,
      fields
    }));
  }

  return {
    type: 'JSON',
    description
  };
}