"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChildrenITC = getChildrenITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getChildrenITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsChildren', opts);
  const description = (0, _utils.desc)(`
    A special single bucket aggregation that enables aggregating from buckets
    on parent document types to buckets on child documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-children-aggregation.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      type: 'String'
    }
  }));
}