"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSearchPaginationResolver;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function createSearchPaginationResolver(searchResolver, opts = {}) {
  const resolver = searchResolver.clone({
    name: `searchPagination`
  });
  resolver.addArgs({
    page: 'Int',
    perPage: {
      type: 'Int',
      defaultValue: 20
    }
  }).removeArg(['limit', 'skip']).reorderArgs(['q', 'query', 'sort', 'aggs', 'page', 'perPage']);
  const searchTC = searchResolver.getTypeComposer();

  if (!searchTC) {
    throw new Error('Cannot get TypeComposer from resolver. Maybe resolver return Scalar?!');
  }

  const typeName = searchTC.getTypeName();
  resolver.setType(searchTC.clone(`${typeName}Pagination`).addFields({
    pageInfo: getPageInfoTC(opts),
    items: [searchTC.get('hits')]
  }).removeField('hits').reorderFields(['items', 'count', 'pageInfo', 'aggregations']));

  resolver.resolve =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (rp) {
      const _rp$args = rp.args,
            args = _rp$args === void 0 ? {} : _rp$args,
            _rp$projection = rp.projection,
            projection = _rp$projection === void 0 ? {} : _rp$projection;
      const page = args.page || 1;

      if (page <= 0) {
        throw new Error('Argument `page` should be positive number.');
      }

      const perPage = args.perPage || 20;

      if (perPage <= 0) {
        throw new Error('Argument `perPage` should be positive number.');
      }

      delete args.page;
      delete args.perPage;
      args.limit = perPage;
      args.skip = (page - 1) * perPage;

      if (projection.items) {
        projection.hits = projection.items;
        delete projection.items;
      }

      const res = yield searchResolver.resolve(rp);
      const items = res.hits || [];
      const itemCount = res.count || 0;

      const result = _objectSpread({}, res, {
        pageInfo: {
          hasNextPage: itemCount > page * perPage,
          hasPreviousPage: page > 1,
          currentPage: page,
          perPage,
          pageCount: Math.ceil(itemCount / perPage),
          itemCount
        },
        items
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
  const name = (0, _utils.getTypeName)('PaginationInfo', opts);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.TypeComposer.create(`
      # Information about pagination.
      type ${name} {
        # Current page number
        currentPage: Int!

        # Number of items per page
        perPage: Int!

        # Total number of pages
        pageCount: Int

        # Total number of items
        itemCount: Int

        # When paginating forwards, are there more items?
        hasNextPage: Boolean

        # When paginating backwards, are there more items?
        hasPreviousPage: Boolean
      }
    `));
}