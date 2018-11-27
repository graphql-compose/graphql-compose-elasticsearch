"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithElastic = composeWithElastic;

var _graphqlCompose = require("graphql-compose");

var _mappingConverter = require("./mappingConverter");

var _search = _interopRequireDefault(require("./resolvers/search"));

var _searchConnection = _interopRequireDefault(require("./resolvers/searchConnection"));

var _searchPagination = _interopRequireDefault(require("./resolvers/searchPagination"));

var _findById = _interopRequireDefault(require("./resolvers/findById"));

var _updateById = _interopRequireDefault(require("./resolvers/updateById"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function composeWithElastic(opts) {
  if (!opts) {
    throw new Error('Opts is required argument for composeWithElastic()');
  }

  if (!opts.elasticMapping || !opts.elasticMapping.properties) {
    throw new Error('You provide incorrect elasticMapping property. It should be an object `{ properties: {} }`');
  }

  if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
    throw new Error('Third arg for Resolver search() should contain `elasticIndex` string property from your Elastic server.');
  }

  if (!opts.elasticType || typeof opts.elasticType !== 'string') {
    throw new Error('Third arg for Resolver search() should contain `elasticType` string property from your Elastic server.');
  }

  if (typeof opts.graphqlTypeName !== 'string' || !opts.graphqlTypeName) {
    throw new Error('Opts.graphqlTypeName is required property for generated GraphQL Type name in composeWithElastic()');
  }

  if (!opts.prefix) {
    opts.prefix = ''; // eslint-disable-line
  }

  if (opts.pluralFields && !Array.isArray(opts.pluralFields)) {
    throw new Error('Opts.pluralFields should be an Array of strings with field names ' + 'which are plural (you may use dot notation for nested fields).');
  }

  const fieldMap = (0, _mappingConverter.inputPropertiesToGraphQLTypes)(opts.elasticMapping);
  const sourceTC = (0, _mappingConverter.convertToSourceTC)(opts.elasticMapping, opts.graphqlTypeName, opts);
  const searchR = (0, _search.default)(fieldMap, sourceTC, opts);
  const searchConnectionR = (0, _searchConnection.default)(searchR, opts);
  const searchPaginationR = (0, _searchPagination.default)(searchR, opts);
  const findByIdR = (0, _findById.default)(fieldMap, sourceTC, opts);
  const updateByIdR = (0, _updateById.default)(fieldMap, sourceTC, opts);
  sourceTC.addResolver(searchR);
  sourceTC.addResolver(searchConnectionR);
  sourceTC.addResolver(searchPaginationR);
  sourceTC.addResolver(findByIdR);
  sourceTC.addResolver(updateByIdR);
  return sourceTC;
}