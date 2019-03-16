/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAllFields } from '../../Commons/FieldNames';

export function getSignificantTermsITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsSignificantTerms', opts);
  const description = desc(
    `
    An aggregation that returns interesting or unusual occurrences of terms in a set.
    The significant_terms aggregation can be very heavy when run on large indices.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-significantterms-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getAllFields(opts),
      min_doc_count: 'Int',
      background_filter: 'JSON',
      execution_hint: 'String',
    },
  }));
}
