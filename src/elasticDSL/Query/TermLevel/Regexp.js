/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getRegexpITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryRegexp', opts);
  const description = desc(`
    The regexp query allows you to use regular expression term queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html)
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
