/* @flow */

import { TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';
import type { FieldsMapByElasticType } from '../mappingConverter';

export type SearchOptsT = {
  prefix?: string,
  postfix?: string,
  fieldMap?: FieldsMapByElasticType,
  sourceTC?: TypeComposer,
};

export function getFindByIdOutputTC(opts: SearchOptsT = {}): TypeComposer {
  const name = getTypeName('FindByIdOutput', opts);

  return getOrSetType(name, () =>
    TypeComposer.create({
      name,
      fields: {
        _index: 'String',
        _type: 'String',
        _id: 'String',
        _version: 'Int',
        _found: 'Boolean',
        _source: opts.sourceTC || 'JSON',
      },
    })
  );
}
