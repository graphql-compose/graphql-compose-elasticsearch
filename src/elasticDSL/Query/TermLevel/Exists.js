/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAllFields } from '../../Commons/FieldNames';

export function getExistsITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('QueryExists', opts);
  const description = desc(
    `
    Returns documents that have at least one non-null value in the original field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-exists-query.html)
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
