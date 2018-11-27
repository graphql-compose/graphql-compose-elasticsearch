"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistogramITC = getHistogramITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getHistogramITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsHistogram', opts);
  const description = (0, _utils.desc)(`
    A multi-bucket values source based aggregation that can be applied on
    numeric values extracted from the documents. It dynamically builds fixed
    size (a.k.a. interval) buckets over the values.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-histogram-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getNumericFields)(opts),
      interval: 'Float',
      missing: 'Float',
      min_doc_count: 'Int',
      extended_bounds: `input ${(0, _utils.getTypeName)('AggsHistogramBounds', opts)} {
          min: Float
          max: Float
        }`,
      order: 'JSON',
      offset: 'Int',
      keyed: 'Boolean'
    }
  }));
}