"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiversifiedSamplerITC = getDiversifiedSamplerITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Script = require("../../Commons/Script");

var _FieldNames = require("../../Commons/FieldNames");

function getDiversifiedSamplerITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsDiversifiedSampler', opts);
  const description = (0, _utils.desc)(`
    A filtering aggregation used to limit any sub aggregations' processing to
    a sample of the top-scoring documents. Diversity settings are used to
    limit the number of matches that share a common value such as an "author".
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-diversified-sampler-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      shard_size: {
        type: 'String',
        defaultValue: 100
      },
      field: (0, _FieldNames.getAllFields)(opts),
      max_docs_per_value: 'Int',
      script: () => (0, _Script.getCommonsScriptITC)(opts),
      execution_hint: 'String'
    }
  }));
}