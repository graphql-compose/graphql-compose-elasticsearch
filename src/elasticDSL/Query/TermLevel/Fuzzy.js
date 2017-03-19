/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getFuzzyITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryFuzzy', opts);
  const description = desc(`
    The fuzzy query uses similarity based on Levenshtein edit distance.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)
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
