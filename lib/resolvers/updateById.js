"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createUpdateByIdResolver;
exports.getRecordITC = getRecordITC;

var _graphqlCompose = require("graphql-compose");

var _ElasticApiParser = _interopRequireDefault(require("../ElasticApiParser"));

var _UpdateByIdOutput = require("../types/UpdateByIdOutput");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function createUpdateByIdResolver(fieldMap, sourceTC, opts) {
  if (!fieldMap || !fieldMap._all) {
    throw new Error('First arg for Resolver updateById() should be fieldMap of FieldsMapByElasticType type.');
  }

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver updateById() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';
  const parser = new _ElasticApiParser.default({
    elasticClient: opts.elasticClient,
    prefix
  });
  const updateByIdFC = parser.generateFieldConfig('update', {
    index: opts.elasticIndex,
    type: opts.elasticType,
    _source: true
  });
  const argsConfigMap = {
    id: 'String!',
    record: getRecordITC(fieldMap).getTypeNonNull()
  };
  const type = (0, _UpdateByIdOutput.getUpdateByIdOutputTC)({
    prefix,
    fieldMap,
    sourceTC
  });
  return new _graphqlCompose.Resolver({
    type,
    name: 'updateById',
    kind: 'mutation',
    args: argsConfigMap,
    resolve: function () {
      var _resolve = _asyncToGenerator(function* (rp) {
        const source = rp.source,
              args = rp.args,
              context = rp.context,
              info = rp.info;
        args.body = {
          doc: _objectSpread({}, args.record)
        };
        delete args.record;
        const res = yield updateByIdFC.resolve(source, args, context, info);

        const _ref = res || {},
              _index = _ref._index,
              _type = _ref._type,
              _id = _ref._id,
              _version = _ref._version,
              result = _ref.result,
              get = _ref.get;

        const _ref2 = get || {},
              _source = _ref2._source;

        return _objectSpread({
          _id,
          _index,
          _type,
          _version,
          result
        }, _source);
      });

      return function resolve(_x) {
        return _resolve.apply(this, arguments);
      };
    }()
  });
}

function getRecordITC(fieldMap) {
  const name = (0, _utils.getTypeName)('Record', {});
  const description = (0, _utils.desc)(`The record from Elastic Search`);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: _objectSpread({}, fieldMap._all)
  }));
}