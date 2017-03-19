/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAllFields } from '../../Commons/FieldNames';

export function getExistsITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryExists', opts);
  const description = desc(
    `
    Returns documents that have at least one non-null value in the original field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        // $FlowFixMe
        field: getAllFields(opts),
      },
    }));
}
