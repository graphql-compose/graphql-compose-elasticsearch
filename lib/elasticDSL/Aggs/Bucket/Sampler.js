"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSamplerITC = getSamplerITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getSamplerITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsSampler', opts);
  const description = (0, _utils.desc)(`
    A filtering aggregation used to limit any sub aggregations' processing
    to a sample of the top-scoring documents.
    Tightening the focus of analytics to high-relevance matches rather than
    the potentially very long tail of low-quality matches.
    This functionality is experimental and may be changed or removed completely.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-sampler-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      shard_size: 'Int'
    }
  }));
}