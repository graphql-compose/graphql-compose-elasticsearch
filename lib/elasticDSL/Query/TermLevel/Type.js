"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypeITC = getTypeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getTypeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryType', opts);
  const description = (0, _utils.desc)(`
    Filters documents matching the provided document / mapping type.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-type-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      value: 'String'
    }
  }));
}