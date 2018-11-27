"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketSelectorITC = getBucketSelectorITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getBucketSelectorITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsBucketSelector', opts);
  const description = (0, _utils.desc)(`
    A parent pipeline aggregation which executes a script which determines
    whether the current bucket will be retained in the parent multi-bucket
    aggregation. The specified metric must be numeric and the script must
    return a boolean value. If the script language is expression then a numeric
    return value is permitted. In this case 0.0 will be evaluated as false
    and all other values will evaluate to true.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-bucket-selector-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      buckets_path: 'JSON!',
      script: 'String!',
      gap_policy: 'String'
    }
  }));
}