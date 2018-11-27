"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUpdateByIdOutputTC = getUpdateByIdOutputTC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getUpdateByIdOutputTC(opts) {
  const name = (0, _utils.getTypeName)('UpdateByIdOutput', opts);

  const _ref = opts || {},
        sourceTC = _ref.sourceTC;

  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.TypeComposer.create({
    name,
    fields: _objectSpread({
      _id: 'String',
      _index: 'String',
      _type: 'String',
      _version: 'Int',
      result: 'String'
    }, sourceTC.getFields())
  }));
}