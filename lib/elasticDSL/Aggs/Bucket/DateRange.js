"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggsDateRangeITC = getAggsDateRangeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Date = require("../../Commons/Date");

var _FieldNames = require("../../Commons/FieldNames");

function getAggsDateRangeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsDateRange', opts);
  const description = (0, _utils.desc)(`
    A range aggregation that is dedicated for date values.
    The \`from\` and \`to\` values can be expressed in Date Math expressions,
    and it is also possible to specify a date format by which the from
    and to response fields will be returned.
    Note that this aggregation includes the \`from\` value and excludes the
    \`to\` value for each range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getDateFields)(opts),
      format: (0, _Date.getDateFormatFC)(opts),
      ranges: () => [(0, _Date.getDateRangeITC)(opts)],
      time_zone: (0, _Date.getDateTimeZoneFC)(opts)
    }
  }));
}