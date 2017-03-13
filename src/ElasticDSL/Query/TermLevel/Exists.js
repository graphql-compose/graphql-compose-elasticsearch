/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getExistsITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryExists', opts);
  const description = desc(`
    Returns documents that have at least one non-null value in the original field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)
  `);

  if (false) {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields: {},
      }));
  }

  // $FlowFixMe
  return {
    type: 'JSON',
    description,
  };
}
