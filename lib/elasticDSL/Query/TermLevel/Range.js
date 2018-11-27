"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRangeITC = getRangeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _FieldNames = require("../../Commons/FieldNames");

function getRangeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryRange', opts);
  const description = (0, _utils.desc)(`
    Matches documents with fields that have terms within a certain range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)
  `);
  const subName = (0, _utils.getTypeName)('QueryRangeSettings', opts);
  const fields = (0, _FieldNames.getAllAsFieldConfigMap)(opts, (0, _utils.getOrSetType)(subName, () => _graphqlCompose.InputTypeComposer.create({
    name: subName,
    fields: {
      gt: 'JSON',
      gte: 'JSON',
      lt: 'JSON',
      lte: 'JSON',
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