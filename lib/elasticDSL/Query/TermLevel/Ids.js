"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIdsITC = getIdsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getIdsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryIds', opts);
  const description = (0, _utils.desc)(`
    Filters documents that only have the provided ids.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      type: 'String!',
      values: '[String]!'
    }
  }));
}