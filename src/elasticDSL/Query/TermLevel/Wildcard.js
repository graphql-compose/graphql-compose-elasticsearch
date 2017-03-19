/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getKeywordAsFieldConfigMap } from '../../Commons/FieldNames';

export function getWildcardITC(opts: mixed = {}): InputTypeComposer {
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
    getOrSetType(subName, () =>
      // $FlowFixMe
      InputTypeComposer.create({
        name: subName,
        fields: {
          value: 'String!',
          boost: 'Float',
        },
      }))
  );

  if (typeof fields === 'object') {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields,
      }));
  }

  // $FlowFixMe
  return {
    type: 'JSON',
    description,
  };
}
