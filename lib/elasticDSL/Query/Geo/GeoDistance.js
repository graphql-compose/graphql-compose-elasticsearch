"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoDistanceITC = getGeoDistanceITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

var _Geo = require("../../Commons/Geo");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getGeoDistanceITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryGeoDistance', opts);
  const description = (0, _utils.desc)(`
    Filters documents that include only hits that exists within
    a specific distance from a geo point.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryGeoDistanceSettings', opts);
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
      fields: _objectSpread({
        distance: {
          type: 'String!',
          description: 'Eg. 12km'
        },
        distance_type: (0, _Geo.getDistanceCalculationModeFC)(opts)
      }, fields, {
        validation_method: 'String'
      })
    }));
  }

  return {
    type: 'JSON',
    description
  };
}