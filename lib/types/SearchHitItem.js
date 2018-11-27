"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchHitItemTC = getSearchHitItemTC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../utils");

function getSearchHitItemTC(opts = {}) {
  const name = (0, _utils.getTypeName)('SearchHitItem', opts);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.TypeComposer.create({
    name,
    fields: {
      _index: 'String',
      _type: 'String',
      _id: 'String',
      _score: 'Float',
      _source: opts.sourceTC || 'JSON',
      // if arg.explain = true
      _shard: {
        type: 'String',
        description: (0, _utils.desc)(`Use explain API on query`)
      },
      _node: {
        type: 'String',
        description: (0, _utils.desc)(`Use explain API on query`)
      },
      _explanation: {
        type: 'JSON',
        description: (0, _utils.desc)(`Use explain API on query`)
      },
      _version: 'Int',
      highlight: {
        type: 'JSON',
        description: 'Returns data only if `args.highlight` is provided'
      },
      // return sort values for search_after
      sort: 'JSON',
      fields: {
        type: 'JSON',
        description: 'Returns result from `args.opts.body.script_fields`'
      }
    }
  }));
}