"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScriptedMetricITC = getScriptedMetricITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Script = require("../../Commons/Script");

function getScriptedMetricITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsScriptedMetric', opts);
  const description = (0, _utils.desc)(`
    A metric aggregation that executes using scripts to provide a metric output.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-scripted-metric-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      init_script: () => (0, _Script.getCommonsScriptITC)(opts),
      map_script: () => (0, _Script.getCommonsScriptITC)(opts),
      combine_script: () => (0, _Script.getCommonsScriptITC)(opts),
      reduce_script: () => (0, _Script.getCommonsScriptITC)(opts),
      params: `input ${(0, _utils.getTypeName)('AggsScriptedMetricParams', opts)} {
          field: String
          _agg: JSON!
        }`
    }
  }));
}