"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDerivativeITC = getDerivativeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getDerivativeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsDerivative', opts);
  const description = (0, _utils.desc)(`
    A parent pipeline aggregation which calculates the derivative of a specified
    metric in a parent histogram (or date_histogram) aggregation. The specified
    metric must be numeric and the enclosing histogram must have min_doc_count
    set to 0 (default for histogram aggregations).
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-derivative-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      buckets_path: 'String!',
      gap_policy: 'String',
      format: 'String',
      unit: 'String'
    }
  }));
}