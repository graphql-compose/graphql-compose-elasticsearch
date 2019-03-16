/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAnalyzedFields } from '../../Commons/FieldNames';

export function getMoreLikeThisITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('QueryMoreLikeThis', opts);
  const description = desc(
    `
    The More Like This Query (MLT Query) finds documents that are "like" a given set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      fields: [getAnalyzedFields(opts)],
      like: 'JSON',
      unlike: 'JSON',
      min_term_freq: 'Int',
      max_query_terms: 'Int',
      boost: 'Float',
    },
  }));
}
