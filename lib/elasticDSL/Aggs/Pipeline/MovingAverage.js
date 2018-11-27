"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMovingAverageITC = getMovingAverageITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getMovingAverageITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsMovingAverage', opts);
  const description = (0, _utils.desc)(`
    Given an ordered series of data, the Moving Average aggregation will slide
    a window across the data and emit the average value of that window.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movavg-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      buckets_path: 'String!',
      format: 'String',
      window: 'Int',
      gap_policy: 'String',
      model: 'String',
      settings: 'JSON'
    }
  }));
}