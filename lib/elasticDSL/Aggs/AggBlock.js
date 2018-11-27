"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggBlockITC = getAggBlockITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

var _AggRules = require("./AggRules");

function getAggBlockITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggBlock', opts);
  const description = (0, _utils.desc)(`
    The aggregations framework helps provide aggregated data based on
    a search query. It is based on simple building blocks called aggregations,
    that can be composed in order to build complex summaries of the data.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      key: {
        type: 'String',
        description: 'FieldName in response for aggregation result'
      },
      value: {
        type: () => (0, _AggRules.getAggRulesITC)(opts),
        description: 'Aggregation rules'
      }
    }
  }));
}