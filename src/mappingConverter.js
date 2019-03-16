/* @flow */
/* eslint-disable no-use-before-define, no-param-reassign */

import {
  ObjectTypeComposer,
  SchemaComposer,
  upperFirst,
  isObject,
  type ComposeInputType,
  type ComposeOutputType,
} from 'graphql-compose';
import { ElasticGeoPointType } from './elasticDSL/Commons/Geo';

export type ElasticMappingT = {
  properties: ElasticMappingPropertiesT,
};

export type ElasticMappingPropertiesT = {
  [propertyName: string]: ElasticPropertyT,
};

export type ElasticPropertyT = {
  type?: string,
  fields?: ElasticMappingPropertiesT,
  properties?: ElasticMappingPropertiesT,
  index?: any,
};

export type InputFieldsMap = {
  [field: string]: ComposeInputType,
};

export type FieldsMapByElasticType = {
  [elasticType: string]: InputFieldsMap,
  _all: InputFieldsMap,
};

export const typeMap = {
  text: 'String',
  keyword: 'String',
  string: 'String',
  byte: 'Int', // 8-bit integer
  short: 'Int', // 16-bit integer
  integer: 'Int', // 32-bit integer
  long: 'Int', // 64-bit (should changed in future for 64 GraphQL type)
  double: 'Float', // 64-bit (should changed in future for 64 GraphQL type)
  float: 'Float', // 32-bit
  half_float: 'Float', // 16-bit
  scaled_float: 'Float',
  date: 'Date',
  boolean: 'Boolean',
  binary: 'Buffer',
  token_count: 'Int',
  ip: 'String',
  geo_point: ElasticGeoPointType, // 'JSON'
  geo_shape: 'JSON',
  object: 'JSON',
  nested: '[JSON]',
  completion: 'String',
  percolator: 'JSON',
};

export type ConvertOptsT = {
  prefix?: ?string,
  postfix?: ?string,
  pluralFields?: string[],
};

export function convertToSourceTC<TContext>(
  schemaComposer: SchemaComposer<TContext>,
  mapping: ElasticMappingT | ElasticPropertyT,
  typeName: string,
  opts?: ConvertOptsT = {}
): ObjectTypeComposer<any, TContext> {
  if (!mapping || !mapping.properties) {
    throw new Error('You provide incorrect mapping. It should be an object `{ properties: {} }`');
  }
  if (!typeName || typeof typeName !== 'string') {
    throw new Error(
      'You provide empty name for type. Second argument `typeName` should be non-empty string.'
    );
  }

  const tc = schemaComposer.createObjectTC({
    name: `${opts.prefix || ''}${typeName}${opts.postfix || ''}`,
    description:
      'Elasticsearch mapping does not contains info about ' +
      'is field plural or not. So `propName` is singular and returns value ' +
      'or first value from array. ' +
      '`propNameA` is plural and returns array of values.',
  });

  const { properties = {} } = mapping;
  const fields = {};
  const pluralFields = opts.pluralFields || [];

  Object.keys(properties).forEach(sourceName => {
    const fieldName = sourceName.replace(/[^_a-zA-Z0-9]/g, '_');
    const gqType = propertyToSourceGraphQLType(
      schemaComposer,
      properties[sourceName],
      `${typeName}${upperFirst(fieldName)}`,
      {
        ...opts,
        pluralFields: getSubFields(sourceName, pluralFields),
      }
    );
    if (gqType) {
      if (pluralFields.indexOf(sourceName) >= 0) {
        fields[fieldName] = {
          type: [gqType],
          resolve: source => {
            if (Array.isArray(source[sourceName])) {
              return source[sourceName];
            }
            return [source[sourceName]];
          },
        };
      } else {
        fields[fieldName] = {
          type: gqType,
          resolve: source => {
            if (Array.isArray(source[sourceName])) {
              return source[sourceName][0];
            }
            return source[sourceName];
          },
        };
      }
    }
  });

  tc.addFields(fields);

  return tc;
}

export function propertyToSourceGraphQLType<TContext>(
  schemaComposer: SchemaComposer<TContext>,
  prop: ElasticPropertyT,
  typeName?: string,
  opts?: ConvertOptsT
): ComposeOutputType<any, TContext> {
  if (!prop || (typeof prop.type !== 'string' && !prop.properties)) {
    throw new Error('You provide incorrect Elastic property config.');
  }

  if (prop.properties) {
    // object type with subfields
    return convertToSourceTC(schemaComposer, prop, typeName || '', opts);
  }

  if (prop.type && typeMap[prop.type]) {
    return typeMap[prop.type];
  }

  return 'JSON';
}

export function inputPropertiesToGraphQLTypes(
  prop: ElasticPropertyT | ElasticMappingT,
  fieldName?: string,
  result?: FieldsMapByElasticType = { _all: {} }
): FieldsMapByElasticType {
  if (!prop || (typeof prop.type !== 'string' && !prop.properties)) {
    throw new Error('You provide incorrect Elastic property config.');
  }

  // mapping
  const { properties } = ((prop: any): ElasticMappingT);
  if (properties && isObject(properties)) {
    Object.keys(properties).forEach(subFieldName => {
      inputPropertiesToGraphQLTypes(
        properties[subFieldName],
        [fieldName, subFieldName].filter(o => !!o).join('__'),
        result
      );
    });
    return result;
  }

  // object type with subfields
  const { fields } = ((prop: any): ElasticPropertyT);
  if (fields && isObject(fields)) {
    Object.keys(fields).forEach(subFieldName => {
      inputPropertiesToGraphQLTypes(
        fields[subFieldName],
        [fieldName, subFieldName].filter(o => !!o).join('__'),
        result
      );
    });
  }

  // skip no index fields
  if ({}.hasOwnProperty.call(prop, 'index') && !prop.index) {
    return result;
  }

  if (typeof prop.type === 'string' && fieldName) {
    if (!result[prop.type]) {
      const newMap: InputFieldsMap = {};
      result[prop.type] = newMap;
    }

    const graphqlType = typeMap[prop.type] || 'JSON';
    result[prop.type][fieldName] = graphqlType;
    result._all[fieldName] = graphqlType;
  }

  return result;
}

export function getSubFields(fieldName: string, pluralFields?: ?(string[])): string[] {
  const st = `${fieldName}.`;
  return (pluralFields || [])
    .filter(o => typeof o === 'string' && o.startsWith(st))
    .map(v => v.slice(st.length));
}
