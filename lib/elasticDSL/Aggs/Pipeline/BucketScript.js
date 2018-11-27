"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketScriptITC = getBucketScriptITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getBucketScriptITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsBucketScript', opts);
  const description = (0, _utils.desc)(`
    A parent pipeline aggregation which executes a script which can perform
    per bucket computations on specified metrics in the parent multi-bucket
    aggregation. The specified metric must be numeric and the script must
    return a numeric value.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-script-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      buckets_path: 'JSON!',
      script: 'String!',
      format: 'String',
      gap_policy: 'String'
    }
  }));
}