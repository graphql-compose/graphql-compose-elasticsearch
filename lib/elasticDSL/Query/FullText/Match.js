"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchITC = getMatchITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getMatchITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryMatch', opts);
  const description = (0, _utils.desc)(`
    Match Query accept text/numerics/dates, analyzes them, and constructs a query.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryMatchSettings', opts);
  const fields = (0, _FieldNames.getAnalyzedAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      query: 'String',
      operator: 'String',
      zero_terms_query: 'String',
      cutoff_frequency: 'Float',
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