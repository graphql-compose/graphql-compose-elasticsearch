/* @flow */

import {
  InputTypeComposer,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAnalyzedAsFieldConfigMap } from '../../Commons/FieldNames';

export function getCommonITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const name = getTypeName('QueryCommon', opts);
  const description = desc(
    `
    The common terms query is a modern alternative to stopwords which improves
    the precision and recall of search results (by taking stopwords into account),
    without sacrificing performance.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html)
  `
  );

  const subName = getTypeName('QueryCommonSettings', opts);
  const fields = getAnalyzedAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        query: 'String',
        cutoff_frequency: 'Float',
        minimum_should_match: 'JSON',
        low_freq_operator: 'String',
        high_freq_operator: 'String',
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
