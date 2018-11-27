"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReverseNestedITC = getReverseNestedITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getReverseNestedITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsReverseNested', opts);
  const description = (0, _utils.desc)(`
    A special single bucket aggregation that enables aggregating on parent docs
    from nested documents.
    The \`reverse_nested\` aggregation must be defined inside a \`nested\` aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-reverse-nested-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      path: 'String'
    }
  }));
}