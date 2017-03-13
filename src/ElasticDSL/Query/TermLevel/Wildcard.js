/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getWildcardITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryWildcard', opts);
  const description = desc(`
    Matches documents that have fields matching a wildcard expression (not analyzed).
    Supported wildcards are *, which matches any character sequence
    (including the empty one), and ?, which matches any single character.
    Note that this query can be slow, as it needs to iterate over many terms.
    In order to prevent extremely slow wildcard queries, a wildcard term
    should not start with one of the wildcards * or ?.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)
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
