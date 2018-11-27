"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIpRangeTypeITC = getIpRangeTypeITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

/* eslint-disable no-unused-vars */
function getIpRangeTypeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('IpRangeType', opts);
  const description = (0, _utils.desc)(`Ip range where \`from\` value includes and \`to\` value excludes.`);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      from: 'String',
      to: 'String',
      mask: {
        type: 'String',
        description: 'IP ranges can also be defined as CIDR masks 10.0.0.127/25'
      }
    }
  }));
}