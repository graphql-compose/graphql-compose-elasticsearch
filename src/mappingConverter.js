/* @flow */
/* eslint-disable no-use-before-define, no-param-reassign */

import {
  TypeComposer,
  GraphQLDate,
  GraphQLJSON,
  GraphQLBuffer,
  upperFirst,
  isObject,
} from 'graphql-compose';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql-compose/lib/graphql';
import type { GraphQLScalarType, GraphQLInputType } from 'graphql-compose/lib/graphql';

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
  [field: string]: GraphQLInputType,
};

export type FieldsMapByElasticType = {
  [elasticType: string]: InputFieldsMap,
  _all: InputFieldsMap,
};

export const typeMap = {
  text: GraphQLString,
  keyword: GraphQLString,
  string: GraphQLString,
  byte: GraphQLInt, // 8-bit integer
  short: GraphQLInt, // 16-bit integer
  integer: GraphQLInt, // 32-bit integer
  long: GraphQLInt, // 64-bit (should changed in future for 64 GraphQL type)
  double: GraphQLFloat, // 64-bit (should changed in future for 64 GraphQL type)
  float: GraphQLFloat, // 32-bit
  half_float: GraphQLFloat, // 16-bit
  scaled_float: GraphQLFloat,
  date: GraphQLDate,
  boolean: GraphQLBoolean,
  binary: GraphQLBuffer,
  token_count: GraphQLInt,
  ip: GraphQLString,
  geo_point: ElasticGeoPointType, // GraphQLJSON
  geo_shape: GraphQLJSON,
  object: GraphQLJSON,
  nested: new GraphQLList(GraphQLJSON),
  completion: GraphQLString,
  percolator: GraphQLJSON,
};

export type ConvertOptsT = {
  prefix?: ?string,
  postfix?: ?string,
  pluralFields?: string[],
};

export function convertToSourceTC(
  mapping: ElasticMappingT | ElasticPropertyT,
  typeName: string,
  opts?: ConvertOptsT = {}
): TypeComposer {
  if (!mapping || !mapping.properties) {
    throw new Error('You provide incorrect mapping. It should be an object `{ properties: {} }`');
  }
  if (!typeName || typeof typeName !== 'string') {
    throw new Error(
      'You provide empty name for type. Second argument `typeName` should be non-empty string.'
    );
  }

  const tc = new TypeComposer(
    new GraphQLObjectType({
      name: `${opts.prefix || ''}${typeName}${opts.postfix || ''}`,
      description:
        'Elasticsearch mapping does not contains info about ' +
        'is field plural or not. So `propName` is singular and returns value ' +
        'or first value from array. ' +
        '`propNameA` is plural and returns array of values.',
      fields: {},
    })
  );

  const { properties = {} } = mapping;
  const fields = {};
  const pluralFields = opts.pluralFields || [];

  Object.keys(properties).forEach(sourceName => {
    const fieldName = sourceName.replace(/[^_a-zA-Z0-9]/g, '_');
    const gqType = propertyToSourceGraphQLType(
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
          type: new GraphQLList(gqType),
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

export function propertyToSourceGraphQLType(
  prop: ElasticPropertyT,
  typeName?: string,
  opts?: ConvertOptsT
): GraphQLObjectType | GraphQLScalarType {
  if (!prop || (typeof prop.type !== 'string' && !prop.properties)) {
    throw new Error('You provide incorrect Elastic property config.');
  }

  if (prop.properties) {
    // object type with subfields
    return convertToSourceTC(prop, typeName || '', opts).getType();
  }

  if (prop.type && typeMap[prop.type]) {
    return typeMap[prop.type];
  }

  return GraphQLJSON;
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

    const graphqlType = typeMap[prop.type] || GraphQLJSON;
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
