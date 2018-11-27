"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToSourceTC = convertToSourceTC;
exports.propertyToSourceGraphQLType = propertyToSourceGraphQLType;
exports.inputPropertiesToGraphQLTypes = inputPropertiesToGraphQLTypes;
exports.getSubFields = getSubFields;
exports.typeMap = void 0;

var _graphqlCompose = require("graphql-compose");

var _Geo = require("./elasticDSL/Commons/Geo");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const typeMap = {
  text: 'String',
  keyword: 'String',
  string: 'String',
  byte: 'Int',
  // 8-bit integer
  short: 'Int',
  // 16-bit integer
  integer: 'Int',
  // 32-bit integer
  long: 'Int',
  // 64-bit (should changed in future for 64 GraphQL type)
  double: 'Float',
  // 64-bit (should changed in future for 64 GraphQL type)
  float: 'Float',
  // 32-bit
  half_float: 'Float',
  // 16-bit
  scaled_float: 'Float',
  date: 'Date',
  boolean: 'Boolean',
  binary: 'Buffer',
  token_count: 'Int',
  ip: 'String',
  geo_point: _Geo.ElasticGeoPointType,
  // 'JSON'
  geo_shape: 'JSON',
  object: 'JSON',
  nested: '[JSON]',
  completion: 'String',
  percolator: 'JSON'
};
exports.typeMap = typeMap;

function convertToSourceTC(mapping, typeName, opts = {}) {
  if (!mapping || !mapping.properties) {
    throw new Error('You provide incorrect mapping. It should be an object `{ properties: {} }`');
  }

  if (!typeName || typeof typeName !== 'string') {
    throw new Error('You provide empty name for type. Second argument `typeName` should be non-empty string.');
  }

  const tc = _graphqlCompose.TypeComposer.create({
    name: `${opts.prefix || ''}${typeName}${opts.postfix || ''}`,
    description: 'Elasticsearch mapping does not contains info about ' + 'is field plural or not. So `propName` is singular and returns value ' + 'or first value from array. ' + '`propNameA` is plural and returns array of values.'
  });

  const _mapping$properties = mapping.properties,
        properties = _mapping$properties === void 0 ? {} : _mapping$properties;
  const fields = {};
  const pluralFields = opts.pluralFields || [];
  Object.keys(properties).forEach(sourceName => {
    const fieldName = sourceName.replace(/[^_a-zA-Z0-9]/g, '_');
    const gqType = propertyToSourceGraphQLType(properties[sourceName], `${typeName}${(0, _graphqlCompose.upperFirst)(fieldName)}`, _objectSpread({}, opts, {
      pluralFields: getSubFields(sourceName, pluralFields)
    }));

    if (gqType) {
      if (pluralFields.indexOf(sourceName) >= 0) {
        fields[fieldName] = {
          type: [gqType],
          resolve: source => {
            if (Array.isArray(source[sourceName])) {
              return source[sourceName];
            }

            return [source[sourceName]];
          }
        };
      } else {
        fields[fieldName] = {
          type: gqType,
          resolve: source => {
            if (Array.isArray(source[sourceName])) {
              return source[sourceName][0];
            }

            return source[sourceName];
          }
        };
      }
    }
  });
  tc.addFields(fields);
  return tc;
}

function propertyToSourceGraphQLType(prop, typeName, opts) {
  if (!prop || typeof prop.type !== 'string' && !prop.properties) {
    throw new Error('You provide incorrect Elastic property config.');
  }

  if (prop.properties) {
    // object type with subfields
    return convertToSourceTC(prop, typeName || '', opts);
  }

  if (prop.type && typeMap[prop.type]) {
    return typeMap[prop.type];
  }

  return 'JSON';
}

function inputPropertiesToGraphQLTypes(prop, fieldName, result = {
  _all: {}
}) {
  if (!prop || typeof prop.type !== 'string' && !prop.properties) {
    throw new Error('You provide incorrect Elastic property config.');
  } // mapping


  const _ref = prop,
        properties = _ref.properties;

  if (properties && (0, _graphqlCompose.isObject)(properties)) {
    Object.keys(properties).forEach(subFieldName => {
      inputPropertiesToGraphQLTypes(properties[subFieldName], [fieldName, subFieldName].filter(o => !!o).join('__'), result);
    });
    return result;
  } // object type with subfields


  const _ref2 = prop,
        fields = _ref2.fields;

  if (fields && (0, _graphqlCompose.isObject)(fields)) {
    Object.keys(fields).forEach(subFieldName => {
      inputPropertiesToGraphQLTypes(fields[subFieldName], [fieldName, subFieldName].filter(o => !!o).join('__'), result);
    });
  } // skip no index fields


  if ({}.hasOwnProperty.call(prop, 'index') && !prop.index) {
    return result;
  }

  if (typeof prop.type === 'string' && fieldName) {
    if (!result[prop.type]) {
      const newMap = {};
      result[prop.type] = newMap;
    }

    const graphqlType = typeMap[prop.type] || 'JSON';
    result[prop.type][fieldName] = graphqlType;
    result._all[fieldName] = graphqlType;
  }

  return result;
}

function getSubFields(fieldName, pluralFields) {
  const st = `${fieldName}.`;
  return (pluralFields || []).filter(o => typeof o === 'string' && o.startsWith(st)).map(v => v.slice(st.length));
}