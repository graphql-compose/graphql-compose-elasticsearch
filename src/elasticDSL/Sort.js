/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { GraphQLEnumType } from 'graphql';
import { getTypeName, getOrSetType } from '../utils';
import { getFieldNamesByElasticType } from './Commons/FieldNames';

const sortableTypes = [
  'byte',
  'short',
  'integer',
  'long',
  'double',
  'float',
  'half_float',
  'scaled_float',
  'token_count',
  'date',
  'boolean',
  'ip',
  'keyword',
];

export function getSortITC(opts: any = {}): InputTypeComposer | string {
  const name = getTypeName('SortEnum', opts);
  const description = 'Sortable fields from mapping';

  if (!opts.fieldMap) {
    return 'JSON';
  }

  return getOrSetType(name, () => {
    const sortableFields = getFieldNamesByElasticType(
      opts.fieldMap,
      sortableTypes
    );
    if (sortableFields.length === 0) {
      return 'JSON';
    }

    const values = {
      _score: {
        value: '_score',
      },
    };
    sortableFields.forEach(fieldName => {
      const dottedName = fieldName.replace('__', '.');
      values[`${fieldName}__asc`] = {
        value: { [dottedName]: 'asc' },
      };
      values[`${fieldName}__desc`] = {
        value: { [dottedName]: 'desc' },
      };
    });

    return new GraphQLEnumType({
      name,
      description,
      values,
    });
  });
}
