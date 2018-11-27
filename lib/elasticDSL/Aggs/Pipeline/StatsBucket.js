"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatsBucketITC = getStatsBucketITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getStatsBucketITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsStatsBucket', opts);
  const description = (0, _utils.desc)(`
    A sibling pipeline aggregation which calculates a variety of stats across
    all bucket of a specified metric in a sibling aggregation. The specified
    metric must be numeric and the sibling aggregation must be a multi-bucket
    aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-stats-bucket-aggregation.html)
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