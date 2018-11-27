/* @flow */

import { TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';
import type { FieldsMapByElasticType } from '../mappingConverter';

export type UpdateByIdOptsT = {
  prefix?: string,
  postfix?: string,
  fieldMap?: FieldsMapByElasticType,
  sourceTC: TypeComposer,
};

export function getUpdateByIdOutputTC(opts: UpdateByIdOptsT): TypeComposer {
  const name = getTypeName('UpdateByIdOutput', opts);
  const { sourceTC } = opts || {};
  return getOrSetType(name, () =>
    TypeComposer.create({
      name,
      fields: {
        _id: 'String',
        _index: 'String',
        _type: 'String',
        _version: 'Int',
        result: 'String',
        ...sourceTC.getFields(),
      },
    })
  );
}
