"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFiltersITC = getFiltersITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getFiltersITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsFilters', opts);
  const description = (0, _utils.desc)(`
    Defines a multi bucket aggregation where each bucket is associated
    with a filter. Each bucket will collect all documents that match
    its associated filter.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filters-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      filters: 'JSON',
      other_bucket: 'Boolean',
      other_bucket_key: 'String'
    }
  }));
}