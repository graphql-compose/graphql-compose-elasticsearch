"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMissingITC = getMissingITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getMissingITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsMissing', opts);
  const description = (0, _utils.desc)(`
    A field data based single bucket aggregation, that creates a bucket of all
    documents in the current document set context that are missing a field
    value (effectively, missing a field or having the configured NULL value set).
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-missing-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getAllFields)(opts)
    }
  }));
}