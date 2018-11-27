"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRangeITC = getRangeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Float = require("../../Commons/Float");

var _Script = require("../../Commons/Script");

var _FieldNames = require("../../Commons/FieldNames");

function getRangeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsRange', opts);
  const description = (0, _utils.desc)(`
    A multi-bucket value source based aggregation that enables the user
    to define a set of ranges - each representing a bucket.
    Note that this aggregation includes the \`from\` value and excludes the
    \`to\` value for each range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-range-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getNumericFields)(opts),
      ranges: () => [(0, _Float.getFloatRangeKeyedITC)(opts)],
      keyed: 'Boolean',
      script: () => (0, _Script.getCommonsScriptITC)(opts)
    }
  }));
}