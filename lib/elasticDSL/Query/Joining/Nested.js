"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNestedITC = getNestedITC;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getNestedITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryNested', opts);
  const description = (0, _utils.desc)(`
    Nested query allows to query nested objects / docs. The query is executed
    against the nested objects / docs as if they were indexed as separate docs.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      path: 'String',
      score_mode: {
        type: 'String',
        description: 'Can be: `avg`, `sum`, `max`, `min`, `none`.'
      },
      query: () => (0, _Query.getQueryITC)(opts)
    }
  }));
}