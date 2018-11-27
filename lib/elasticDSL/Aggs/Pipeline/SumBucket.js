"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSumBucketITC = getSumBucketITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getSumBucketITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsSumBucket', opts);
  const description = (0, _utils.desc)(`
    A sibling pipeline aggregation which calculates the sum across all bucket
    of a specified metric in a sibling aggregation. The specified metric must
    be numeric and the sibling aggregation must be a multi-bucket aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-sum-bucket-aggregation.html)
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