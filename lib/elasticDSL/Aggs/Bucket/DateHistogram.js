"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateHistogramITC = getDateHistogramITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Script = require("../../Commons/Script");

var _Date = require("../../Commons/Date");

var _FieldNames = require("../../Commons/FieldNames");

function getDateHistogramITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsDateHistogram', opts);
  const description = (0, _utils.desc)(`
    A multi-bucket aggregation similar to the histogram except it can only
    be applied on date values.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getDateFields)(opts),
      interval: (0, _Date.getDateIntervalFC)(opts),
      time_zone: (0, _Date.getDateTimeZoneFC)(opts),
      offset: (0, _Date.getDateIntervalFC)(opts),
      format: (0, _Date.getDateFormatFC)(opts),
      missing: 'String',
      script: () => (0, _Script.getCommonsScriptITC)(opts)
    }
  }));
}