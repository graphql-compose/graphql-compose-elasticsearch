"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScriptITC = getScriptITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Script = require("../../Commons/Script");

function getScriptITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryScript', opts);
  const description = (0, _utils.desc)(`
    A query allowing to define scripts as queries. They are typically used in a filter context.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-script-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      script: () => (0, _Script.getCommonsScriptITC)(opts)
    }
  }));
}