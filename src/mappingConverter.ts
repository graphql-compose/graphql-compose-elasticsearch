/* eslint-disable no-use-before-define, no-param-reassign */

import {
  ObjectTypeComposer,
  SchemaComposer,
  upperFirst,
  isObject,
  ComposeInputTypeDefinition,
  ComposeOutputTypeDefinition,
} from 'graphql-compose';
import { ElasticGeoPointType } from './elasticDSL/Commons/Geo';

export type ElasticMappingT = {
  properties: ElasticMappingPropertiesT;
};

export type ElasticMappingPropertiesT = {
  [propertyName: string]: ElasticPropertyT;
};

export type ElasticPropertyT = {
  type?: string;
  fields?: ElasticMappingPropertiesT;
  properties?: ElasticMappingPropertiesT;
  index?: any;
};

export type InputFieldsMap = {
  [field: string]: ComposeInputTypeDefinition;
};

export type FieldsMapByElasticType = {
  [elasticType: string]: InputFieldsMap;
  _all: InputFieldsMap;
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
  prefix?: string | null;
  postfix?: string | null;
  pluralFields?: string[];
};

export function convertToSourceTC<TContext>(
  schemaComposer: SchemaComposer<TContext>,
  mapping: ElasticMappingT | ElasticPropertyT,
  typeName: string,
  opts: ConvertOptsT = {}
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
  const fields = {} as Record<string, any>;
  const pluralFields = opts.pluralFields || [];

  Object.keys(properties).forEach((sourceName) => {
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
          resolve: (source: any) => {
            if (Array.isArray(source[sourceName])) {
              return source[sourceName];
            }
            return [source[sourceName]];
          },
        };
      } else {
        fields[fieldName] = {
          type: gqType,
          resolve: (source: any) => {
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
): ComposeOutputTypeDefinition<TContext> {
  if (!prop || (typeof prop.type !== 'string' && !prop.properties)) {
    throw new Error('You provide incorrect Elastic property config.');
  }

  if (prop.properties) {
    // object type with subfields
    return convertToSourceTC(schemaComposer, prop, typeName || '', opts);
  }

  const type = prop.type as keyof typeof typeMap;
  if (type && typeMap[type]) {
    return typeMap[type];
  }

  return 'JSON';
}

export function inputPropertiesToGraphQLTypes(
  prop: ElasticPropertyT | ElasticMappingT,
  fieldName?: string,
  result: FieldsMapByElasticType = { _all: {} }
): FieldsMapByElasticType {
  if (
    !prop ||
    (typeof (prop as ElasticPropertyT).type !== 'string' && !(prop as ElasticMappingT).properties)
  ) {
    throw new Error('You provide incorrect Elastic property config.');
  }

  // mapping
  const { properties } = prop as ElasticMappingT;
  if (properties && isObject(properties)) {
    Object.keys(properties).forEach((subFieldName) => {
      inputPropertiesToGraphQLTypes(
        properties[subFieldName],
        [fieldName, subFieldName].filter((o) => !!o).join('__'),
        result
      );
    });
    return result;
  }

  // object type with subfields
  const { fields } = prop as ElasticPropertyT;
  if (fields && isObject(fields)) {
    Object.keys(fields).forEach((subFieldName) => {
      inputPropertiesToGraphQLTypes(
        fields[subFieldName],
        [fieldName, subFieldName].filter((o) => !!o).join('__'),
        result
      );
    });
  }

  // skip no index fields
  if (prop.hasOwnProperty('index') && !(prop as ElasticPropertyT).index) {
    return result;
  }

  const type = (prop as ElasticPropertyT).type;
  if (typeof type === 'string' && fieldName) {
    if (!result[type]) {
      const newMap: InputFieldsMap = {};
      result[type] = newMap;
    }

    const graphqlType = (typeMap as any)[type] || 'JSON';
    result[type][fieldName] = graphqlType;
    result._all[fieldName] = graphqlType;
  }

  return result;
}

export function getSubFields(fieldName: string, pluralFields?: string[]): string[] {
  const st = `${fieldName}.`;
  return (pluralFields || [])
    .filter((o) => typeof o === 'string' && o.startsWith(st))
    .map((v) => v.slice(st.length));
}
