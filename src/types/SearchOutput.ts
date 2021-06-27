import { ObjectTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts } from '../utils';
import getShardsTC from './Shards';
import { getSearchHitItemTC } from './SearchHitItem';

export function getSearchOutputTC<TContext>(
  opts: CommonOpts<TContext>
): ObjectTypeComposer<any, TContext> {
  const name = getTypeName('SearchOutput', opts);
  const nameHits = getTypeName('SearchHits', opts);

  return opts.getOrCreateOTC(name, () => ({
    name,
    fields: {
      took: 'Int',
      timed_out: 'Boolean',
      _shards: getShardsTC(opts),
      hits: opts.getOrCreateOTC(nameHits, () => ({
        name: nameHits,
        fields: {
          total: 'Int',
          max_score: 'Float',
          hits: [getSearchHitItemTC(opts)],
        },
      })),
      aggregations: 'JSON',
    },
  }));
}
