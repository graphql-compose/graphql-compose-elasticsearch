"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegexpITC = getRegexpITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getRegexpITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryRegexp', opts);
  const description = (0, _utils.desc)(`
    The regexp query allows you to use regular expression term queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryRegexpSettings', opts);
  const fields = (0, _FieldNames.getStringAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      value: 'String!',
      boost: 'Float',
      flags: 'String',
      max_determinized_states: 'Int'
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