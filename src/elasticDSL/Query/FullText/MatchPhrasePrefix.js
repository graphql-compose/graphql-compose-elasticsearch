/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAnalyzedAsFieldConfigMap } from '../../Commons/FieldNames';

export function getMatchPhrasePrefixITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryMatchPhrasePrefix', opts);
  const description = desc(
    `
    The match_phrase_prefix is the same as match_phrase, except that it allows
    for prefix matches on the last term in the text. Eg "quick brown f"
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html)
  `
  );

  const subName = getTypeName('QueryMatchPhrasePrefixSettings', opts);
  const fields = getAnalyzedAsFieldConfigMap(
    opts,
    getOrSetType(subName, () =>
      // $FlowFixMe
      InputTypeComposer.create({
        name: subName,
        fields: {
          query: 'String',
          max_expansions: 'Int',
        },
      }))
  );

  if (typeof fields === 'object') {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields,
      }));
  }

  // $FlowFixMe
  return {
    type: 'JSON',
    description,
  };
}
