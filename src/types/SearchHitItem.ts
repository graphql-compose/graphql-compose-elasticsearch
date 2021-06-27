import { ObjectTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../utils';

export function getSearchHitItemTC<TContext>(
  opts: CommonOpts<TContext>
): ObjectTypeComposer<any, TContext> {
  const name = getTypeName('SearchHitItem', opts);

  return opts.getOrCreateOTC(name, () => ({
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

      _version: 'Int',

      highlight: {
        type: 'JSON',
        description: 'Returns data only if `args.highlight` is provided',
      },

      // return sort values for search_after
      sort: 'JSON',

      fields: {
        type: 'JSON',
        description: 'Returns result from `args.opts.body.script_fields`',
      },
    },
  }));
}
