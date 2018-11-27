"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTermsITC = getTermsITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getTermsITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryTerms', opts);
  const description = (0, _utils.desc)(`
    Filters documents that have fields that match any of
    the provided terms (not analyzed). { fieldName: [values] }
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)
  `);
  const fields = (0, _FieldNames.getAllAsFieldConfigMap)(opts, '[JSON]');

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