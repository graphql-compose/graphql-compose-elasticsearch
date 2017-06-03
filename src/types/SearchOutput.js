/* @flow */

import { TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';
import type { FieldsMapByElasticType } from '../mappingConverter';
import getShardsTC from './Shards';
import { getSearchHitItemTC } from './SearchHitItem';

export type SearchOptsT = {
  prefix?: string,
  postfix?: string,
  fieldMap?: FieldsMapByElasticType,
  sourceTC?: TypeComposer,
};

export function getSearchOutputTC(opts: SearchOptsT = {}): TypeComposer {
  const name = getTypeName('SearchOutput', opts);
  const nameHits = getTypeName('SearchHits', opts);

  return getOrSetType(name, () =>
    // $FlowFixMe
    TypeComposer.create({
      name,
      fields: {
        took: 'Int',
        timed_out: 'Boolean',
        _shards: getShardsTC(opts),
        hits: getOrSetType(nameHits, () =>
          // $FlowFixMe
          TypeComposer.create({
            name: nameHits,
            fields: {
              total: 'Int',
              max_score: 'Float',
              hits: [getSearchHitItemTC(opts)],
            },
          })
        ),
        aggregations: 'JSON',
      },
    })
  );
}
