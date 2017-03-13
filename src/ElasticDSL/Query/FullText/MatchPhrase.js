/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getMatchPhraseITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryMatchPhrase', opts);
  const description = desc(`
    The match_phrase query analyzes the text and creates a phrase query out
    of the analyzed text.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html)
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
