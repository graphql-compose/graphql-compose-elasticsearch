"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMoreLikeThisITC = getMoreLikeThisITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getMoreLikeThisITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryMoreLikeThis', opts);
  const description = (0, _utils.desc)(`
    The More Like This Query (MLT Query) finds documents that are "like" a given set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      fields: [(0, _FieldNames.getAnalyzedFields)(opts)],
      like: 'JSON',
      unlike: 'JSON',
      min_term_freq: 'Int',
      max_query_terms: 'Int',
      boost: 'Float'
    }
  }));
}