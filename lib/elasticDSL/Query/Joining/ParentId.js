"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParentIdITC = getParentIdITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getParentIdITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryParentId', opts);
  const description = (0, _utils.desc)(`
    The parent_id query can be used to find child documents
    which belong to a particular parent.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-parent-id-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      type: 'String',
      id: 'String',
      ignore_unmapped: 'Boolean'
    }
  }));
}