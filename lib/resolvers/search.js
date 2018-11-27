"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSearchResolver;
exports.toDottedList = toDottedList;

var _graphqlCompose = require("graphql-compose");

var _ElasticApiParser = _interopRequireDefault(require("../ElasticApiParser"));

var _SearchBody = require("../elasticDSL/SearchBody");

var _SearchOutput = require("../types/SearchOutput");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function createSearchResolver(fieldMap, sourceTC, opts) {
  if (!fieldMap || !fieldMap._all) {
    throw new Error('First arg for Resolver search() should be fieldMap of FieldsMapByElasticType type.');
  }

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver search() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';
  const parser = new _ElasticApiParser.default({
    elasticClient: opts.elasticClient,
    prefix
  });
  const searchITC = (0, _SearchBody.getSearchBodyITC)({
    prefix,
    fieldMap
  }).removeField(['size', 'from', '_source', 'explain', 'version']);
  const searchFC = parser.generateFieldConfig('search', {
    index: opts.elasticIndex,
    type: opts.elasticType
  });
  const argsConfigMap = Object.assign({}, searchFC.args, {
    body: {
      type: searchITC.getType()
    }
  });
  delete argsConfigMap.index; // index can not be changed, it hardcoded in searchFC

  delete argsConfigMap.type; // type can not be changed, it hardcoded in searchFC

  delete argsConfigMap.explain; // added automatically if requested _shard, _node, _explanation

  delete argsConfigMap.version; // added automatically if requested _version

  delete argsConfigMap._source; // added automatically due projection

  delete argsConfigMap._sourceExclude; // added automatically due projection

  delete argsConfigMap._sourceInclude; // added automatically due projection

  delete argsConfigMap.trackScores; // added automatically due projection (is _scrore requested with sort)

  delete argsConfigMap.maxConcurrentShardRequests; // Induce error cause the default value is dynamic.

  delete argsConfigMap.size;
  delete argsConfigMap.from;
  argsConfigMap.limit = 'Int';
  argsConfigMap.skip = 'Int';

  const bodyITC = _graphqlCompose.InputTypeComposer.create(argsConfigMap.body.type);

  argsConfigMap.query = bodyITC.getField('query');
  argsConfigMap.aggs = bodyITC.getField('aggs');
  argsConfigMap.sort = bodyITC.getField('sort');
  argsConfigMap.highlight = bodyITC.getField('highlight');
  const topLevelArgs = ['q', 'query', 'sort', 'limit', 'skip', 'aggs', 'highlight', 'opts'];
  argsConfigMap.opts = _graphqlCompose.InputTypeComposer.create({
    name: `${sourceTC.getTypeName()}Opts`,
    fields: Object.assign({}, argsConfigMap)
  }).removeField(topLevelArgs);
  Object.keys(argsConfigMap).forEach(argKey => {
    if (topLevelArgs.indexOf(argKey) === -1) {
      delete argsConfigMap[argKey];
    }
  });
  const type = (0, _SearchOutput.getSearchOutputTC)({
    prefix,
    fieldMap,
    sourceTC
  });
  let hitsType;

  try {
    hitsType = type.get('hits.hits');
  } catch (e) {
    hitsType = 'JSON';
  }

  type.addFields({
    count: 'Int',
    max_score: 'Float',
    hits: hitsType ? [hitsType] : 'JSON'
  }).reorderFields(['hits', 'count', 'aggregations', 'max_score', 'took', 'timed_out', '_shards']);
  return new _graphqlCompose.Resolver({
    type,
    name: 'search',
    kind: 'query',
    args: argsConfigMap,
    resolve: function () {
      var _resolve = _asyncToGenerator(function* (rp) {
        let args = rp.args || {};
        const projection = rp.projection || {};
        if (!args.body) args.body = {};

        if ({}.hasOwnProperty.call(args, 'limit')) {
          args.size = args.limit;
          delete args.limit;
        }

        if ({}.hasOwnProperty.call(args, 'skip')) {
          args.from = args.skip;
          delete args.skip;
        }

        const _projection$hits = projection.hits,
              hits = _projection$hits === void 0 ? {} : _projection$hits;

        if (hits && typeof hits === 'object') {
          // Turn on explain if in projection requested this fields:
          if (hits._shard || hits._node || hits._explanation) {
            args.body.explain = true;
          }

          if (hits._version) {
            args.body.version = true;
          }

          if (!hits._source) {
            args.body._source = false;
          } else {
            args.body._source = toDottedList(hits._source);
          }

          if (hits._score) {
            args.body.track_scores = true;
          }
        }

        if (args.query) {
          args.body.query = args.query;
          delete args.query;
        }

        if (args.aggs) {
          args.body.aggs = args.aggs;
          delete args.aggs;
        }

        if (args.highlight) {
          args.body.highlight = args.highlight;
          delete args.highlight;
        }

        if (args.sort) {
          args.body.sort = args.sort;
          delete args.sort;
        }

        if (args.opts) {
          args = _objectSpread({}, args.opts, args, {
            body: _objectSpread({}, args.opts.body, args.body)
          });
          delete args.opts;
        }

        if (args.body) {
          args.body = (0, _SearchBody.prepareBodyInResolve)(args.body, fieldMap);
        }

        const res = yield searchFC.resolve(rp.source, args, rp.context, rp.info);
        res.count = res.hits.total;
        res.max_score = res.hits.max_score;
        res.hits = res.hits.hits;
        return res;
      });

      return function resolve(_x) {
        return _resolve.apply(this, arguments);
      };
    }()
  }).reorderArgs(['q', 'query', 'sort', 'limit', 'skip', 'aggs']);
}

function toDottedList(projection, prev) {
  let result = [];
  Object.keys(projection).forEach(k => {
    if ((0, _graphqlCompose.isObject)(projection[k])) {
      const tmp = toDottedList(projection[k], prev ? [...prev, k] : [k]);

      if (Array.isArray(tmp)) {
        result = result.concat(tmp);
        return;
      }
    }

    if (prev) {
      result.push([...prev, k].join('.'));
    } else {
      result.push(k);
    }
  });
  return result.length > 0 ? result : true;
}