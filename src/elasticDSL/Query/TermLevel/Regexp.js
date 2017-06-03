/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getStringAsFieldConfigMap } from '../../Commons/FieldNames';

export function getRegexpITC(opts: mixed = {}): InputTypeComposer {
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
    getOrSetType(subName, () =>
      InputTypeComposer.create({
        name: subName,
        fields: {
          value: 'String!',
          boost: 'Float',
          flags: 'String',
          max_determinized_states: 'Int',
        },
      })
    )
  );

  if (typeof fields === 'object') {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields,
      })
    );
  }

  // $FlowFixMe
  return {
    type: 'JSON',
    description,
  };
}
