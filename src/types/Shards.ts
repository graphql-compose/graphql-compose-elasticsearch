import { ObjectTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts } from '../utils';

export default function getShardsTC<TContext>(
  opts: CommonOpts<TContext>
): ObjectTypeComposer<any, TContext> {
  const name = getTypeName('MetaShards', opts);

  return opts.getOrCreateOTC(name, () => ({
    name,
    fields: {
      total: 'Int',
      successful: 'Int',
      failed: 'Int',
    },
  }));
}
