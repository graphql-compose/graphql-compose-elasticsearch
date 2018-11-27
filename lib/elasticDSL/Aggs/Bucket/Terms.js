"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTermsITC = getTermsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Script = require("../../Commons/Script");

var _FieldNames = require("../../Commons/FieldNames");

function getTermsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsTerms', opts);
  const description = (0, _utils.desc)(`
    A multi-bucket value source based aggregation where buckets
    are dynamically built - one per unique value.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      field: () => (0, _FieldNames.getTermFields)(opts),
      size: {
        type: 'Int',
        defaultValue: 10
      },
      shard_size: 'Int',
      order: 'JSON',
      include: 'JSON',
      exclude: 'JSON',
      script: () => (0, _Script.getCommonsScriptITC)(opts),
      execution_hint: 'String',
      missing: 'JSON'
    }
  }));
}