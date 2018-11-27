"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFloatRangeITC = getFloatRangeITC;
exports.getFloatRangeKeyedITC = getFloatRangeKeyedITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

/* eslint-disable no-unused-vars */
function getFloatRangeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('FloatRange', opts);
  const description = (0, _utils.desc)(`Float range where \`from\` value includes and \`to\` value excludes.`);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      from: 'Float',
      to: 'Float'
    }
  }));
}

function getFloatRangeKeyedITC(opts = {}) {
  const name = (0, _utils.getTypeName)('FloatRangeKeyed', opts);
  const description = (0, _utils.desc)(`
    Float range where \`from\` value includes and \`to\` value excludes and
    may have a key for aggregation.
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      from: 'Float',
      to: 'Float',
      key: 'String'
    }
  }));
}