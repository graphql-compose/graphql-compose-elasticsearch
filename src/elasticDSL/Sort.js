/* @flow */

import type { ComposeInputType } from 'graphql-compose';
import { getTypeName, type CommonOpts } from '../utils';
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

export function getSortITC<TContext>(opts: CommonOpts<TContext>): ComposeInputType {
  const name = getTypeName('SortEnum', opts);
  const description = 'Sortable fields from mapping';

  if (!opts.fieldMap) {
    return opts.schemaComposer.getSTC('JSON');
  }

  return (opts.schemaComposer.getOrSet(name, () => {
    const sortableFields = getFieldNamesByElasticType(opts.fieldMap, sortableTypes);
    if (sortableFields.length === 0) {
      return opts.schemaComposer.getSTC('JSON');
    }

    const values = {
      _score: {
        value: '_score',
      },
    };
    sortableFields.forEach(fieldName => {
      const dottedName = fieldName.replace(/__/g, '.');
      values[`${fieldName}__asc`] = {
        value: { [dottedName]: 'asc' },
      };
      values[`${fieldName}__desc`] = {
        value: { [dottedName]: 'desc' },
      };
    });

    return opts.schemaComposer.createEnumTC({
      name,
      description,
      values,
    });
  }): any);
}
