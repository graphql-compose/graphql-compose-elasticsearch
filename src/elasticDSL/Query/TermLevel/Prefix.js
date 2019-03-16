/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getKeywordAsFieldConfigMap } from '../../Commons/FieldNames';

export function getPrefixITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ComposeInputFieldConfigAsObject {
  const name = getTypeName('QueryPrefix', opts);
  const description = desc(
    `
    Matches documents that have fields containing terms with a specified prefix (not analyzed).
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-prefix-query.html)
  `
  );

  const subName = getTypeName('QueryPrefixSettings', opts);
  const fields = getKeywordAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        value: 'String!',
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
