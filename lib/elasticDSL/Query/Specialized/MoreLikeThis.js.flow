/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAnalyzedFields } from '../../Commons/FieldNames';

export function getMoreLikeThisITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryMoreLikeThis', opts);
  const description = desc(
    `
    The More Like This Query (MLT Query) finds documents that are "like" a given set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
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
    })
  );
}
