"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypeName = getTypeName;
exports.getOrSetType = getOrSetType;
exports.desc = desc;
exports.reorderKeys = reorderKeys;
exports.fetchElasticMapping = fetchElasticMapping;

var _graphqlCompose = require("graphql-compose");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const typeStorage = new _graphqlCompose.TypeStorage();

function getTypeName(name, opts) {
  return `${opts && opts.prefix || 'Elastic'}${name}${opts && opts.postfix || ''}`;
}

function getOrSetType(typeName, typeOrThunk) {
  const type = typeStorage.getOrSet(typeName, typeOrThunk);
  return type;
} // Remove newline multiline in descriptions


function desc(str) {
  return str.replace(/\n\s+/gi, ' ').replace(/^\s+/, '');
}

function reorderKeys(obj, names) {
  const orderedFields = {};

  const fields = _objectSpread({}, obj);

  names.forEach(name => {
    if (fields[name]) {
      orderedFields[name] = fields[name];
      delete fields[name];
    }
  });
  return _objectSpread({}, orderedFields, fields);
}

function fetchElasticMapping(_x) {
  return _fetchElasticMapping.apply(this, arguments);
}

function _fetchElasticMapping() {
  _fetchElasticMapping = _asyncToGenerator(function* (opts) {
    if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
      throw new Error('Must provide `elasticIndex` string parameter from your Elastic server.');
    }

    if (!opts.elasticType || typeof opts.elasticType !== 'string') {
      throw new Error('Must provide `elasticType` string parameter from your Elastic server.');
    }

    if (!opts.elasticClient) {
      throw new Error('Must provide `elasticClient` Object parameter connected to your Elastic server.');
    }

    const elasticMapping = (yield opts.elasticClient.indices.getMapping({
      index: opts.elasticIndex,
      type: opts.elasticType
    }))[opts.elasticIndex].mappings[opts.elasticType];
    return elasticMapping;
  });
  return _fetchElasticMapping.apply(this, arguments);
}