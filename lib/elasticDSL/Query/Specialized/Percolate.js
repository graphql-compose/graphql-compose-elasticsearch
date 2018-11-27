"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPercolateITC = getPercolateITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getPercolateITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryPercolate', opts);
  const description = (0, _utils.desc)(`
    The percolate query can be used to match queries stored in an index.
    The percolate query itself contains the document that will be used
    as query to match with the stored queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-percolate-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: (0, _FieldNames.getPercolatorFields)(opts),
      document_type: 'String!',
      document: 'JSON!'
    }
  }));
}