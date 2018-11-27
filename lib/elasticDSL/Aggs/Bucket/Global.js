"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalITC = getGlobalITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getGlobalITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsGlobal', opts);
  const description = (0, _utils.desc)(`
    Defines a single bucket of all the documents within the search execution
    context. This context is defined by the indices and the document types
    you’re searching on, but is not influenced by the search query itself.
    Should have empty body, without fields, eg. \`global: {}\`
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-global-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      _without_fields_: 'JSON'
    }
  }));
}