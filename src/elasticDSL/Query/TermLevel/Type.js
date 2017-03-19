/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getTypeITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryType', opts);
  const description = desc(
    `
    Filters documents matching the provided document / mapping type.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-type-query.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        value: 'String',
      },
    }));
}
