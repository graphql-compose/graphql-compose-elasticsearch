/* @flow */

import { TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';
import type { FieldsMapByElasticType } from '../mappingConverter';

export type FindByIdOptsT = {
  prefix?: string,
  postfix?: string,
  fieldMap?: FieldsMapByElasticType,
  sourceTC: TypeComposer,
};

export function getFindByIdOutputTC(opts: FindByIdOptsT): TypeComposer {
  const name = getTypeName('FindByIdOutput', opts);
  const { sourceTC } = opts || {};
  return getOrSetType(name, () =>
    TypeComposer.create({
      name,
      fields: {
        _id: 'String',
        _index: 'String',
        _type: 'String',
        _version: 'Int',
        ...sourceTC.getFields(),
      },
    })
  );
}
