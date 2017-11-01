/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAnalyzedAsFieldConfigMap } from '../../Commons/FieldNames';

export function getFuzzyITC(opts: mixed = {}): InputTypeComposer | ComposeInputFieldConfigAsObject {
  const name = getTypeName('QueryFuzzy', opts);
  const description = desc(
    `
    The fuzzy query uses similarity based on Levenshtein edit distance.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html)
  `
  );

  const subName = getTypeName('QueryFuzzySettings', opts);
  const fields = getAnalyzedAsFieldConfigMap(
    opts,
    getOrSetType(subName, () =>
      InputTypeComposer.create({
        name: subName,
        fields: {
          value: 'String!',
          boost: 'Float',
          fuzziness: 'Int',
          prefix_length: 'Int',
          max_expansions: 'Int',
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
