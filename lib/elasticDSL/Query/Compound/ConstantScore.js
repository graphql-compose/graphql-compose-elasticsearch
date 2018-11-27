"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConstantScoreITC = getConstantScoreITC;
exports.prepareConstantScoreInResolve = prepareConstantScoreInResolve;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getConstantScoreITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryConstantScore', opts);
  const description = (0, _utils.desc)(`
    A query that wraps another query and simply returns a constant score equal
    to the query boost for every document in the filter.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      filter: () => (0, _Query.getQueryITC)(opts).getTypeNonNull(),
      boost: 'Float!'
    }
  }));
}
/* eslint-disable no-param-reassign, camelcase */


function prepareConstantScoreInResolve(constant_score, fieldMap) {
  if (constant_score.filter) {
    constant_score.filter = (0, _Query.prepareQueryInResolve)(constant_score.filter, fieldMap);
  }

  return constant_score;
}