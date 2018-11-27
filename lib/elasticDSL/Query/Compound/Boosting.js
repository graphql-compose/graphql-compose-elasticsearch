"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBoostingITC = getBoostingITC;
exports.prepareBoostingInResolve = prepareBoostingInResolve;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getBoostingITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryBoosting', opts);
  const description = (0, _utils.desc)(`
    The boosting query can be used to effectively demote results that match a given query.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-boosting-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      positive: () => (0, _Query.getQueryITC)(opts),
      negative: () => (0, _Query.getQueryITC)(opts),
      negative_boost: 'Float'
    }
  }));
}

function prepareBoostingInResolve(boosting, fieldMap) {
  /* eslint-disable no-param-reassign */
  if (boosting.positive) {
    boosting.positive = (0, _Query.prepareQueryInResolve)(boosting.positive, fieldMap);
  }

  if (boosting.negative) {
    boosting.negative = (0, _Query.prepareQueryInResolve)(boosting.negative, fieldMap);
  }

  return boosting;
}