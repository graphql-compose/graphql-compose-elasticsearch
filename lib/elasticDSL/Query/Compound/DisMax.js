"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisMaxITC = getDisMaxITC;
exports.prepareDisMaxResolve = prepareDisMaxResolve;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getDisMaxITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryDisMax', opts);
  const description = (0, _utils.desc)(`
    A query that generates the union of documents produced by its subqueries,
    and that scores each document with the maximum score for that document
    as produced by any subquery, plus a tie breaking increment
    for any additional matching subqueries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      queries: () => [(0, _Query.getQueryITC)(opts)],
      boost: 'Float',
      tie_breaker: 'Float'
    }
  }));
}
/* eslint-disable no-param-reassign, camelcase */


function prepareDisMaxResolve(dis_max, fieldMap) {
  if (Array.isArray(dis_max.queries)) {
    dis_max.queries = dis_max.queries.map(query => (0, _Query.prepareQueryInResolve)(query, fieldMap));
  }

  return dis_max;
}