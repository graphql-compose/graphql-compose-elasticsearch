/* @flow */

import { ObjectTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts } from '../utils';

export function getUpdateByIdOutputTC<TContext>(
  opts: CommonOpts<TContext>
): ObjectTypeComposer<any, TContext> {
  const name = getTypeName('UpdateByIdOutput', opts);
  const { sourceTC } = opts;
  return opts.getOrCreateOTC(name, () => ({
    name,
    fields: {
      _id: 'String',
      _index: 'String',
      _type: 'String',
      _version: 'Int',
      result: 'String',
      ...sourceTC.getFields(),
    },
  }));
}
