"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWildcardITC = getWildcardITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getWildcardITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryWildcard', opts);
  const description = (0, _utils.desc)(`
    Matches documents that have fields matching a wildcard expression (not analyzed).
    In order to prevent extremely SLOW wildcard queries, term should not start
    from * or ?.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryWildcardSettings', opts);
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