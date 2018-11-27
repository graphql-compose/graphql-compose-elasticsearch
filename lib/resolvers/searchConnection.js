"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSearchConnectionResolver;
exports.base64 = base64;
exports.unbase64 = unbase64;
exports.cursorToData = cursorToData;
exports.dataToCursor = dataToCursor;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function createSearchConnectionResolver(searchResolver, opts = {}) {
  const resolver = searchResolver.clone({
    name: `searchConnection`
  });
  resolver.addArgs({
    first: 'Int',
    after: 'String',
    last: 'Int',
    before: 'String'
  }).removeArg(['limit', 'skip']).reorderArgs(['q', 'query', 'sort', 'aggs', 'first', 'after', 'last', 'before']);
  const searchTC = searchResolver.getTypeComposer();

  if (!searchTC) {
    throw new Error('Cannot get TypeComposer from resolver. Maybe resolver return Scalar?!');
  }

  const typeName = searchTC.getTypeName();
  resolver.setType(searchTC.clone(`${typeName}Connection`).addFields({
    pageInfo: getPageInfoTC(opts),
    edges: [_graphqlCompose.TypeComposer.create({
      name: `${typeName}Edge`,
      fields: {
        node: searchTC.get('hits'),
        cursor: 'String!'
      }
    })]
  }).removeField('hits').reorderFields(['count', 'pageInfo', 'edges', 'aggregations']));

  resolver.resolve =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (rp) {
      const _rp$args = rp.args,
            args = _rp$args === void 0 ? {} : _rp$args,
            _rp$projection = rp.projection,
            projection = _rp$projection === void 0 ? {} : _rp$projection;

      if (!args.sort || !Array.isArray(args.sort) || args.sort.length === 0) {
        throw new Error('Argument `sort` is required for the Relay Connection. According to ' + 'the fields in `sort` will be constructed `cursor`s for every edge. ' + 'Values of fields which used in `sort` should be unique in compound.');
      }

      const first = parseInt(args.first, 10) || 0;

      if (first < 0) {
        throw new Error('Argument `first` should be non-negative number.');
      }

      const last = parseInt(args.last, 10) || 0;

      if (last < 0) {
        throw new Error('Argument `last` should be non-negative number.');
      }

      const before = args.before,
            after = args.after;
      delete args.before;
      delete args.after;

      if (before !== undefined) {
        throw new Error('Elastic does not support before cursor.');
      }

      if (after) {
        if (!args.body) args.body = {};
        const tmp = cursorToData(after);

        if (Array.isArray(tmp)) {
          args.body.search_after = tmp;
        }
      }

      const limit = last || first || 20;
      const skip = last > 0 ? first - last : 0;
      delete args.last;
      delete args.first;
      args.limit = limit + 1; // +1 document, to check next page presence

      args.skip = skip;

      if (projection.edges) {
        projection.hits = projection.edges.node;
        delete projection.edges;
      }

      const res = yield searchResolver.resolve(rp);
      let list = res.hits || [];
      const hasExtraRecords = list.length > limit;
      if (hasExtraRecords) list = list.slice(0, limit);
      const cursorMap = new Map();
      const edges = list.map(node => {
        const cursor = dataToCursor(node.sort);

        if (cursorMap.has(cursor)) {
          throw new Error(`Argument \`sort {${args.sort.join(', ')}}\` must be more complex! ` + 'Values from record which are used in `sort` will be used for `cursor` fields. ' + 'According to connection spec `cursor` must be unique for every node.' + 'Detected that two nodes have ' + `the same cursors '${cursor}' with data '${unbase64(cursor)}'. ` + 'You must add more `sort` fields, which provide unique data ' + 'for all cursors in the result set.');
        }

        cursorMap.set(cursor, node);
        return {
          node,
          cursor
        };
      });

      const result = _objectSpread({}, res, {
        pageInfo: {
          hasNextPage: limit > 0 && hasExtraRecords,
          hasPreviousPage: false,
          // Elastic does not support before cursor
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
        },
        edges
      });

      return result;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  return resolver;
}

function getPageInfoTC(opts = {}) {
  const name = (0, _utils.getTypeName)('PageInfo', opts);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.TypeComposer.create(`
      # Information about pagination in a connection.
      type ${name} {
        # When paginating forwards, are there more items?
        hasNextPage: Boolean!

        # When paginating backwards, are there more items?
        hasPreviousPage: Boolean!

        # When paginating backwards, the cursor to continue.
        startCursor: String

        # When paginating forwards, the cursor to continue.
        endCursor: String
      }
    `));
}

function base64(i) {
  return Buffer.from(i, 'ascii').toString('base64');
}

function unbase64(i) {
  return Buffer.from(i, 'base64').toString('ascii');
}

function cursorToData(cursor) {
  if (typeof cursor === 'string') {
    try {
      return JSON.parse(unbase64(cursor)) || null;
    } catch (err) {
      return null;
    }
  }

  return null;
}

function dataToCursor(data) {
  if (!data) return '';
  return base64(JSON.stringify(data));
}