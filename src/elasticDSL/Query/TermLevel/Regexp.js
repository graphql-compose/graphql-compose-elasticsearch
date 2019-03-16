/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getStringAsFieldConfigMap } from '../../Commons/FieldNames';

export function getRegexpITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ComposeInputFieldConfigAsObject {
  const name = getTypeName('QueryRegexp', opts);
  const description = desc(
    `
    The regexp query allows you to use regular expression term queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html)
  `
  );

  const subName = getTypeName('QueryRegexpSettings', opts);
  const fields = getStringAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        value: 'String!',
        boost: 'Float',
        flags: 'String',
        max_determinized_states: 'Int',
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
