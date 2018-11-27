"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTermITC = getTermITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getTermITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryTerm', opts);
  const description = (0, _utils.desc)(`
    Find documents which contain the exact term specified
    in the field specified.
    { fieldName: value } or { fieldName: { value: value, boost: 2.0 } }
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryTermSettings', opts);
  const fields = (0, _FieldNames.getAllAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      value: 'JSON!',
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