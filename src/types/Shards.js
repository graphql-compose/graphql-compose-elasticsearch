import { TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';

export default function getShardsTC(opts: mixed = {}): TypeComposer {
  const name = getTypeName('MetaShards', opts);

  return getOrSetType(name, () =>
    // $FlowFixMe
    TypeComposer.create({
      name,
      fields: {
        total: 'Int',
        successful: 'Int',
        failed: 'Int',
      },
    }));
}
