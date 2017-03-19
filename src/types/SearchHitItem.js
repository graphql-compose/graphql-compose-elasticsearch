/* @flow */

import { TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../utils';
import type { SearchOptsT } from './SearchOutput';

export function getSearchHitItemTC(opts: SearchOptsT = {}): TypeComposer {
  const name = getTypeName('SearchHitItem', opts);

  return getOrSetType(name, () =>
    // $FlowFixMe
    TypeComposer.create({
      name,
      fields: {
        _index: 'String',
        _type: 'String',
        _id: 'String',
        _score: 'Float',
        _source: opts.sourceTC || 'JSON',

        // if arg.explain = true
        _shard: {
          type: 'String',
          description: desc(`Use explain API on query`),
        },
        _node: {
          type: 'String',
          description: desc(`Use explain API on query`),
        },
        _explanation: {
          type: 'JSON',
          description: desc(`Use explain API on query`),
        },

        // if arg.version = true
        _version: 'Int',

        // if args.highlight is provided
        highlight: 'JSON',

        // return sort values for search_after
        sort: 'JSON',
      },
    }));
}
