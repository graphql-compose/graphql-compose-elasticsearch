/* @flow */

import { Resolver, TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';

export default function createSearchPaginationResolver(
  searchResolver: Resolver,
  opts: mixed = {}
): Resolver {
  const resolver = searchResolver.clone({
    name: `searchPagination`,
  });

  resolver
    .addArgs({
      page: 'Int',
      perPage: {
        type: 'Int',
        defaultValue: 20,
      },
    })
    .removeArg(['limit', 'skip'])
    .reorderArgs(['q', 'query', 'sort', 'aggs', 'page', 'perPage']);

  const searchTC = searchResolver.getTypeComposer();
  if (!searchTC) {
    throw new Error('Cannot get TypeComposer from resolver. Maybe resolver return Scalar?!');
  }

  const typeName = searchTC.getTypeName();
  resolver.setType(
    searchTC
      .clone(`${typeName}Pagination`)
      .addFields({
        pageInfo: getPageInfoTC(opts),
        items: [searchTC.get('hits')],
      })
      .removeField('hits')
      .reorderFields(['items', 'count', 'pageInfo', 'aggregations'])
  );

  resolver.resolve = async rp => {
    const { args = {}, projection = {} } = rp;

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

    const res = await searchResolver.resolve(rp);

    const items = res.hits || [];
    const itemCount = res.count || 0;

    const result = {
      ...res,
      pageInfo: {
        hasNextPage: itemCount > page * perPage,
        hasPreviousPage: page > 1,
        currentPage: page,
        perPage,
        pageCount: Math.ceil(itemCount / perPage),
        itemCount,
      },
      items,
    };

    return result;
  };

  return resolver;
}

function getPageInfoTC(opts: mixed = {}): TypeComposer {
  const name = getTypeName('PaginationInfo', opts);

  return getOrSetType(name, () =>
    TypeComposer.create(
      `
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
    `
    )
  );
}
