"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIpRangeITC = getIpRangeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Ip = require("../../Commons/Ip");

var _FieldNames = require("../../Commons/FieldNames");

function getIpRangeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsIpRange', opts);
  const description = (0, _utils.desc)(`
    A range aggregation that is dedicated for IP values.
    Note that this aggregation includes the \`from\` value and excludes the
    \`to\` value for each range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-iprange-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getIpFields)(opts),
      ranges: () => [(0, _Ip.getIpRangeTypeITC)(opts)]
    }
  }));
}