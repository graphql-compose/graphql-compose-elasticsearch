/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getIdsITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryIds', opts);
  const description = desc(
    `
    Filters documents that only have the provided ids.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        type: 'String!',
        values: '[String]!',
      },
    })
  );
}
