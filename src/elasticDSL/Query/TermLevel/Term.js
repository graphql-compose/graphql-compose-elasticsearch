/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAllAsFieldConfigMap } from '../../Commons/FieldNames';

export function getTermITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ComposeInputFieldConfigAsObject {
  const name = getTypeName('QueryTerm', opts);
  const description = desc(
    `
    Find documents which contain the exact term specified
    in the field specified.
    { fieldName: value } or { fieldName: { value: value, boost: 2.0 } }
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-term-query.html)
  `
  );

  const subName = getTypeName('QueryTermSettings', opts);
  const fields = getAllAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        value: 'JSON!',
        boost: 'Float',
        fuzziness: 'Int',
        prefix_length: 'Int',
        max_expansions: 'Int',
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
