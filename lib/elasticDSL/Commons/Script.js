"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonsScriptITC = getCommonsScriptITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

function getCommonsScriptITC(opts = {}) {
  const name = (0, _utils.getTypeName)('CommonsScript', opts);
  const description = (0, _utils.desc)(`
    The scripting module enables you to use scripts to evaluate custom expressions.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      lang: 'String!',
      inline: 'String!',
      params: 'JSON',
      file: 'String'
    }
  }));
}