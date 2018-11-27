"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFuzzyITC = getFuzzyITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getFuzzyITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryFuzzy', opts);
  const description = (0, _utils.desc)(`
    The fuzzy query uses similarity based on Levenshtein edit distance.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryFuzzySettings', opts);
  const fields = (0, _FieldNames.getAnalyzedAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      value: 'String!',
      boost: 'Float',
      fuzziness: 'Int',
      prefix_length: 'Int',
      max_expansions: 'Int'
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