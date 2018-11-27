"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFindByIdResolver;

var _graphqlCompose = require("graphql-compose");

var _ElasticApiParser = _interopRequireDefault(require("../ElasticApiParser"));

var _FindByIdOutput = require("../types/FindByIdOutput");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function createFindByIdResolver(fieldMap, sourceTC, opts) {
  if (!fieldMap || !fieldMap._all) {
    throw new Error('First arg for Resolver findById() should be fieldMap of FieldsMapByElasticType type.');
  }

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver findById() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';
  const parser = new _ElasticApiParser.default({
    elasticClient: opts.elasticClient,
    prefix
  });
  const findByIdFC = parser.generateFieldConfig('get', {
    index: opts.elasticIndex,
    type: opts.elasticType
  });
  const argsConfigMap = {
    id: 'String!'
  };
  const type = (0, _FindByIdOutput.getFindByIdOutputTC)({
    prefix,
    fieldMap,
    sourceTC
  });
  return new _graphqlCompose.Resolver({
    type,
    name: 'findById',
    kind: 'query',
    args: argsConfigMap,
    resolve: function () {
      var _resolve = _asyncToGenerator(function* (rp) {
        const source = rp.source,
              args = rp.args,
              context = rp.context,
              info = rp.info;

        if (!args.id) {
          throw new Error(`Missed 'id' argument!`);
        }

        const res = yield findByIdFC.resolve(source, args, context, info);

        const _ref = res || {},
              _index = _ref._index,
              _type = _ref._type,
              _id = _ref._id,
              _version = _ref._version,
              _source = _ref._source;

        return _objectSpread({
          _index,
          _type,
          _id,
          _version
        }, _source);
      });

      return function resolve(_x) {
        return _resolve.apply(this, arguments);
      };
    }()
  });
}