"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchPhraseITC = getMatchPhraseITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getMatchPhraseITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryMatchPhrase', opts);
  const description = (0, _utils.desc)(`
    The match_phrase query analyzes the text and creates a phrase query out
    of the analyzed text.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryMatchPhraseSettings', opts);
  const fields = (0, _FieldNames.getAnalyzedAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      query: 'String',
      analyzer: 'String',
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