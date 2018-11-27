/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAllAsFieldConfigMap } from '../../Commons/FieldNames';

export function getTermITC(opts: mixed = {}): InputTypeComposer | ComposeInputFieldConfigAsObject {
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
    getOrSetType(subName, () =>
      InputTypeComposer.create({
        name: subName,
        fields: {
          value: 'JSON!',
          boost: 'Float',
          fuzziness: 'Int',
          prefix_length: 'Int',
          max_expansions: 'Int',
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

  return {
    type: 'JSON',
    description,
  };
}
