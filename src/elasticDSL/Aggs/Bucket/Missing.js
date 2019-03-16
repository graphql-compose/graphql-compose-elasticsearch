/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAllFields } from '../../Commons/FieldNames';

export function getMissingITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsMissing', opts);
  const description = desc(
    `
    A field data based single bucket aggregation, that creates a bucket of all
    documents in the current document set context that are missing a field
    value (effectively, missing a field or having the configured NULL value set).
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-missing-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getAllFields(opts),
    },
  }));
}
