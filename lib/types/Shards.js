"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getShardsTC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../utils");

function getShardsTC(opts = {}) {
  const name = (0, _utils.getTypeName)('MetaShards', opts);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.TypeComposer.create({
    name,
    fields: {
      total: 'Int',
      successful: 'Int',
      failed: 'Int'
    }
  }));
}