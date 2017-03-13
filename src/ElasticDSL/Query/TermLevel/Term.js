/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getTermITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryTerm', opts);
  const description = desc(`
    Find documents which contain the exact term specified
    in the field specified.
    { fieldName: value } or { fieldName: { value: value, boost: 2.0 } }
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)
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
