/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAllAsFieldConfigMap } from '../../Commons/FieldNames';

export function getRangeITC(opts: mixed = {}): InputTypeComposer | ComposeInputFieldConfigAsObject {
  const name = getTypeName('QueryRange', opts);
  const description = desc(
    `
    Matches documents with fields that have terms within a certain range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)
  `
  );

  const subName = getTypeName('QueryRangeSettings', opts);
  const fields = getAllAsFieldConfigMap(
    opts,
    getOrSetType(subName, () =>
      InputTypeComposer.create({
        name: subName,
        fields: {
          gt: 'JSON',
          gte: 'JSON',
          lt: 'JSON',
          lte: 'JSON',
          boost: 'Float',
        },
      })
    )
  );

  if (typeof fields === 'object') {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields,
      })
    );
  }

  return {
    type: 'JSON',
    description,
  };
}
