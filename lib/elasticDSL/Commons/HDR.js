"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonsHdrITC = getCommonsHdrITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

function getCommonsHdrITC(opts = {}) {
  const name = (0, _utils.getTypeName)('CommonsHDR', opts);
  const description = (0, _utils.desc)(`
    A High Dynamic Range (HDR) Histogram.
    [Documentation](https://github.com/HdrHistogram/HdrHistogram)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      number_of_significant_value_digits: 'Int'
    }
  }));
}