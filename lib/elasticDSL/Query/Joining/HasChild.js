"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHasChildITC = getHasChildITC;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getHasChildITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryHasChild', opts);
  const description = (0, _utils.desc)(`
    The has_child filter accepts a query and the child type to run against,
    and results in parent documents that have child docs matching the query.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      type: 'String',
      query: () => (0, _Query.getQueryITC)(opts),
      score_mode: {
        type: 'String',
        description: 'Can be: `avg`, `sum`, `max`, `min`, `none`.'
      },
      min_children: 'Int',
      max_children: 'Int'
    }
  }));
}