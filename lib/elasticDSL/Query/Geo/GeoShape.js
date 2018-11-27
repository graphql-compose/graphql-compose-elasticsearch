"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoShapeITC = getGeoShapeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getGeoShapeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryGeoShape', opts);
  const description = (0, _utils.desc)(`
    Filter documents indexed using the geo_shape type.
    Requires the geo_shape Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryGeoShapeSettings', opts);
  const fields = (0, _FieldNames.getGeoShapeAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      shape: 'JSON',
      relation: 'JSON',
      indexed_shape: 'JSON'
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