"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchPhrasePrefixITC = getMatchPhrasePrefixITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getMatchPhrasePrefixITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryMatchPhrasePrefix', opts);
  const description = (0, _utils.desc)(`
    The match_phrase_prefix is the same as match_phrase, except that it allows
    for prefix matches on the last term in the text. Eg "quick brown f"
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryMatchPhrasePrefixSettings', opts);
  const fields = (0, _FieldNames.getAnalyzedAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      query: 'String',
      max_expansions: 'Int',
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