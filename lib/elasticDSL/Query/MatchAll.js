"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchAllITC = getMatchAllITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

function getMatchAllITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryMatchAll', opts);
  const description = (0, _utils.desc)(`
    The most simple query, which matches all documents,
    giving them all a _score of 1.0.
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      boost: {
        type: 'Float'
      }
    }
  }));
}