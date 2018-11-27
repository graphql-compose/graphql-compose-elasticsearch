"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxBucketITC = getMaxBucketITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getMaxBucketITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsMaxBucket', opts);
  const description = (0, _utils.desc)(`
    A sibling pipeline aggregation which identifies the bucket(s) with
    the maximum value of a specified metric in a sibling aggregation and
    outputs both the value and the key(s) of the bucket(s). The specified
    metric must be numeric and the sibling aggregation must be a multi-bucket
    aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-max-bucket-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      buckets_path: 'String!',
      gap_policy: 'String',
      format: 'String'
    }
  }));
}