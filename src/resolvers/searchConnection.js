/* @Flow */

import { Resolver, TypeComposer, isObject } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';

export default function createSearchConnectionResolver(
  searchResolver: Resolver<*, *>,
  opts: mixed = {}
): Resolver<*, *> {
  const resolver = searchResolver.clone({
    name: `${searchResolver.name}Connection`,
  });

  resolver.addArgs({
    first: 'Int',
    after: 'String',
    last: 'Int',
    before: 'String',
  });
  resolver.removeArg('limit');
  resolver.removeArg('skip');

  const searchType = searchResolver.getTypeComposer();
  const typeName = searchType.getTypeName();
  const type = searchType.clone(`${typeName}Connection`);
  type.addFields({
    pageInfo: getPageInfoTC(opts),
    edges: [
      TypeComposer.create({
        name: `${typeName}Edge`,
        fields: {
          node: searchType.get('hits.hits'),
          cursor: 'String!',
        },
      }),
    ],
  });
  type.removeField('hits');
  resolver.setType(type);

  resolver.resolve = async rp => {
    const { args = {} } = rp;

    const first = parseInt(args.first, 10) || 0;
    if (first < 0) {
      throw new Error('Argument `first` should be non-negative number.');
    }
    const last = parseInt(args.last, 10) || 0;
    if (last < 0) {
      throw new Error('Argument `last` should be non-negative number.');
    }

    let limit = last || first || 20;
    let skip = last > 0 ? first - last : 0;

    delete rp.args.last;
    delete rp.args.first;
    rp.args.limit = limit;
    rp.args.skip = skip;

    const res = await searchResolver.resolve(rp);
    const list = res.hits.hits;
    const result = {
      ...res,
      pageInfo: {},  // TODO <------------------
      edges: list.map(node => ({ node, cursor: dataToCursor(node.sort) })),
    };

    return result;
  };

  return resolver;
}

function getPageInfoTC(opts: mixed = {}): TypeComposer {
  const name = getTypeName('PageInfo', opts);

  return getOrSetType(name, () =>
    TypeComposer.create(
      `
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
    `
    ));
}

export function base64(i: string): string {
  return new Buffer(i, 'ascii').toString('base64');
}

export function unbase64(i: string): string {
  return new Buffer(i, 'base64').toString('ascii');
}

export function cursorToData(cursor: string): mixed {
  if (typeof cursor === 'string') {
    try {
      return JSON.parse(unbase64(cursor)) || null;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export function dataToCursor(data: mixed): string {
  return base64(JSON.stringify(data));
}
