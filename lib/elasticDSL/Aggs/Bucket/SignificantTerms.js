"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignificantTermsITC = getSignificantTermsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getSignificantTermsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsSignificantTerms', opts);
  const description = (0, _utils.desc)(`
    An aggregation that returns interesting or unusual occurrences of terms in a set.
    The significant_terms aggregation can be very heavy when run on large indices.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-significantterms-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getAllFields)(opts),
      min_doc_count: 'Int',
      background_filter: 'JSON',
      execution_hint: 'String'
    }
  }));
}