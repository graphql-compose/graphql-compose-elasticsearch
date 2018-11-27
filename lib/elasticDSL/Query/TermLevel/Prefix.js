"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrefixITC = getPrefixITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getPrefixITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryPrefix', opts);
  const description = (0, _utils.desc)(`
    Matches documents that have fields containing terms with a specified prefix (not analyzed).
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryPrefixSettings', opts);
  const fields = (0, _FieldNames.getKeywordAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      value: 'String!',
      boost: 'Float'
    }
  })));

  if (typeof fields === 'object') {
    return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
      name,
      description,
      fields
    }));
  }

  return {
    type: 'JSON',
    description
  };
}