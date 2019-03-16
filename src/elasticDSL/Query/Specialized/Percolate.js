/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getPercolatorFields } from '../../Commons/FieldNames';

export function getPercolateITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('QueryPercolate', opts);
  const description = desc(
    `
    The percolate query can be used to match queries stored in an index.
    The percolate query itself contains the document that will be used
    as query to match with the stored queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-percolate-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getPercolatorFields(opts),
      document_type: 'String!',
      document: 'JSON!',
    },
  }));
}
