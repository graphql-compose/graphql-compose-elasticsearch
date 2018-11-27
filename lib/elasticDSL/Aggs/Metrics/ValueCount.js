"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueCountITC = getValueCountITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Script = require("../../Commons/Script");

var _FieldNames = require("../../Commons/FieldNames");

function getValueCountITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsValueCount', opts);
  const description = (0, _utils.desc)(`
    A single-value metrics aggregation that counts the number of values that
    are extracted from the aggregated documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-valuecount-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getAllFields)(opts),
      script: () => (0, _Script.getCommonsScriptITC)(opts)
    }
  }));
}