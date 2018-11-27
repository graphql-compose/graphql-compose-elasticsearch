"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSerialDifferencingITC = getSerialDifferencingITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getSerialDifferencingITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsSerialDifferencing', opts);
  const description = (0, _utils.desc)(`
    Serial differencing is a technique where values in a time series are
    subtracted from itself at different time lags or periods.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-serialdiff-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      buckets_path: 'String!',
      lag: 'String',
      gap_policy: 'String',
      format: 'String'
    }
  }));
}