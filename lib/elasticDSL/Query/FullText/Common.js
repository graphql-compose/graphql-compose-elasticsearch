"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonITC = getCommonITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getCommonITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryCommon', opts);
  const description = (0, _utils.desc)(`
    The common terms query is a modern alternative to stopwords which improves
    the precision and recall of search results (by taking stopwords into account),
    without sacrificing performance.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryCommonSettings', opts);
  const fields = (0, _FieldNames.getAnalyzedAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      query: 'String',
      cutoff_frequency: 'Float',
      minimum_should_match: 'JSON',
      low_freq_operator: 'String',
      high_freq_operator: 'String',
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