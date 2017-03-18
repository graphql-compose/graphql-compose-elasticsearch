/* @flow */
/* eslint-disable no-param-reassign */

import { upperFirst } from 'graphql-compose';
import { GraphQLEnumType } from 'graphql';
import type { GraphQLEnumValueConfigMap } from 'graphql/type/definition';
import { getTypeName, getOrSetType, desc } from '../../utils';

export type ElasticDataType = string;

export function getStringFields(opts: mixed) {
  return getFieldNamesType(opts, ['text', 'keyword', 'string'], 'String');
}

export function getNumericFields(opts: mixed) {
  return getFieldNamesType(
    opts,
    [
      'byte',
      'short',
      'integer',
      'long',
      'double',
      'float',
      'half_float',
      'scaled_float',
      'token_count',
    ],
    'Numeric'
  );
}

export function getDateFields(opts: mixed) {
  return getFieldNamesType(opts, ['date'], 'Date');
}

export function getBooleanFields(opts: mixed) {
  return getFieldNamesType(opts, ['boolean'], 'Boolean');
}

export function getGeoPointFields(opts: mixed) {
  return getFieldNamesType(opts, ['geo_point'], 'GeoPoint');
}

export function getNestedFields(opts: mixed) {
  return getFieldNamesType(opts, ['nested'], 'Nested');
}

export function getIpFields(opts: mixed) {
  return getFieldNamesType(opts, ['ip'], 'Ip');
}

export function getAllFields(opts: mixed) {
  return getFieldNamesType(opts, ['_all'], 'All');
}

export function getFieldNamesType(
  opts: mixed,
  types: ElasticDataType[],
  typePrefix: string
) {
  if (!types) {
    types = ['_all'];
    typePrefix = 'All';
  }
  if (!typePrefix) {
    types.sort();
    typePrefix = types.map(t => upperFirst(t)).join('');
  }
  const name = getTypeName(`${typePrefix}Fields`, opts);
  const description = desc(`Avaliable fields.`);

  return getOrSetType(name, () => {
    if (!opts || !opts.fieldMap) {
      return 'String';
    }
    const values = getEnumValues(opts.fieldMap, types);

    if (Object.keys(values).length === 0) {
      return 'String';
    }

    return new GraphQLEnumType({
      name,
      description,
      values,
    });
  });
}

function getEnumValues(
  fieldMap: any,
  types: ElasticDataType[]
): GraphQLEnumValueConfigMap {
  const values = {};
  types.forEach(type => {
    if (typeof fieldMap[type] === 'object') {
      Object.keys(fieldMap[type]).forEach(fieldName => {
        values[fieldName] = {
          value: fieldName,
        };
      });
    }
  });
  return values;
}
