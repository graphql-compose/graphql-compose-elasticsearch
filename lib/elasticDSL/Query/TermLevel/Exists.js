"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExistsITC = getExistsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getExistsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryExists', opts);
  const description = (0, _utils.desc)(`
    Returns documents that have at least one non-null value in the original field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getAllFields)(opts)
    }
  }));
}