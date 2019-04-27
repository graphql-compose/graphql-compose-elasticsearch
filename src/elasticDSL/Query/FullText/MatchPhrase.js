/* @flow */

import {
  InputTypeComposer,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAnalyzedAsFieldConfigMap } from '../../Commons/FieldNames';

export function getMatchPhraseITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const name = getTypeName('QueryMatchPhrase', opts);
  const description = desc(
    `
    The match_phrase query analyzes the text and creates a phrase query out
    of the analyzed text.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html)
  `
  );

  const subName = getTypeName('QueryMatchPhraseSettings', opts);
  const fields = getAnalyzedAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        query: 'String',
        analyzer: 'String',
        boost: 'Float',
      },
    }))
  );

  if (typeof fields === 'object') {
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields,
    }));
  }

  return {
    type: 'JSON',
    description,
  };
}
