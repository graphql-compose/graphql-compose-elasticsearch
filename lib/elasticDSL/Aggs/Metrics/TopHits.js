"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopHitsITC = getTopHitsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getTopHitsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsTopHits', opts);
  const description = (0, _utils.desc)(`
    A top_hits metric aggregator keeps track of the most relevant document being
    aggregated. This aggregator is intended to be used as a sub aggregator,
    so that the top matching documents can be aggregated per bucket.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-top-hits-aggregation.html#search-aggregations-metrics-top-hits-aggregation)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      from: 'Int',
      size: 'Int',
      sort: 'JSON',
      _source: 'JSON'
    }
  }));
}