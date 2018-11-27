"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExtendedStatsITC = getExtendedStatsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Script = require("../../Commons/Script");

var _FieldNames = require("../../Commons/FieldNames");

function getExtendedStatsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsExtendedStats', opts);
  const description = (0, _utils.desc)(`
    A multi-value metrics aggregation that computes stats over numeric values
    extracted from the aggregated documents. These values can be extracted
    either from specific numeric fields in the documents, or be generated
    by a provided script.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-extendedstats-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getNumericFields)(opts),
      sigma: 'Float',
      missing: 'Float',
      script: () => (0, _Script.getCommonsScriptITC)(opts)
    }
  }));
}