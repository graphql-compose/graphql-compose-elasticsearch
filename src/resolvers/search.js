/* @flow */
/* eslint-disable no-param-reassign */

import { Resolver, TypeComposer } from 'graphql-compose';

export default function createSearchResolver(
  propsMap: MongooseModelT,
  tc: TypeComposer,
  opts?: createResolverOpts
): Resolver {
  if (!propsMap || !propsMap._all) {
    throw new Error(
      'First arg for Resolver search() should be propsMap.'
    );
  }

  if (!(tc instanceof TypeComposer)) {
    throw new Error('Second arg for Resolver findMany() should be instance of TypeComposer.');
  }

  return new Resolver({
    // $FlowFixMe
    type: [tc],
    name: 'search',
    kind: 'query',
    args: {
      ...filterHelperArgs(tc, model, {
        filterTypeName: `FilterFindMany${tc.getTypeName()}Input`,
        model,
        ...(opts && opts.filter),
      }),
      ...skipHelperArgs(),
      ...limitHelperArgs({
        ...(opts && opts.limit),
      }),
      ...sortHelperArgs(model, {
        sortTypeName: `SortFindMany${tc.getTypeName()}Input`,
        ...(opts && opts.sort),
      }),
    },
    resolve: (resolveParams: ExtendedResolveParams) => {
      resolveParams.query = model.find();
      return resolveParams.query.exec();
    },
  });
}
