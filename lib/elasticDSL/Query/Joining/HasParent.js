"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHasParentITC = getHasParentITC;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getHasParentITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryHasParent', opts);
  const description = (0, _utils.desc)(`
    The has_parent query accepts a query and a parent type. The query is executed
    in the parent document space, which is specified by the parent type
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-parent-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      parent_type: 'String',
      query: () => (0, _Query.getQueryITC)(opts),
      score: 'Boolean',
      ignore_unmapped: 'Boolean'
    }
  }));
}