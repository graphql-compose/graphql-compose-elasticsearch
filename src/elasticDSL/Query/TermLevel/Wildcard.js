/* @flow */

import {
  InputTypeComposer,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getKeywordAsFieldConfigMap } from '../../Commons/FieldNames';

export function getWildcardITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const name = getTypeName('QueryWildcard', opts);
  const description = desc(
    `
    Matches documents that have fields matching a wildcard expression (not analyzed).
    In order to prevent extremely SLOW wildcard queries, term should not start
    from * or ?.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)
  `
  );

  const subName = getTypeName('QueryWildcardSettings', opts);
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
