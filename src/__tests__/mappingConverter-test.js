/* @flow */

import { TypeComposer, InputTypeComposer, GraphQLJSON } from 'graphql-compose';

import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';

import {
  convertToSourceTC,
  propertyToSourceGraphQLType,
  convertToAggregatableITC,
  inputPropertiesToGraphQLTypes,
  convertToSearchableITC,
  convertToAnalyzedITC,
  getSubFields,
} from '../mappingConverter';

const mapping = {
  properties: {
    name: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
      },
    },
    avatarUrl: {
      properties: {
        big: {
          type: 'text',
        },
        thumb: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
      },
    },
    lastname: {
      type: 'text',
    },
    birthday: {
      type: 'date',
    },
    noIndex: {
      type: 'date',
      index: false,
    },
  },
};

describe('PropertiesConverter', () => {
  describe('convertToSourceTC()', () => {
    it('should throw error on empty mapping', () => {
      // $FlowFixMe
      expect(() => convertToSourceTC()).toThrowError('incorrect mapping');
    });

    it('should throw error on empty typeName', () => {
      expect(() => {
        // $FlowFixMe
        convertToSourceTC(mapping);
      }).toThrowError('empty name');
    });

    it('should return TypeComposer', () => {
      const tc = convertToSourceTC(mapping, 'TestMapping');
      expect(tc).toBeInstanceOf(TypeComposer);
      expect(tc.getTypeName()).toBe('TestMapping');
      expect(tc.getFieldNames()).toEqual(
        expect.arrayContaining(['name', 'avatarUrl'])
      );
    });

    it('should make singular and plural fields', () => {
      const tc1 = convertToSourceTC(mapping, 'TestMapping');
      const singular: any = tc1.getField('name');
      expect(singular.type).toBe(GraphQLString);

      const tc2 = convertToSourceTC(mapping, 'TestMapping', {
        pluralFields: ['name'],
      });
      const plural: any = tc2.getField('name');
      expect(plural.type).toBeInstanceOf(GraphQLList);
      expect(plural.type.ofType).toBe(GraphQLString);
    });
  });

  describe('propertyToSourceGraphQLType()', () => {
    it('should throw error on wrong property config', () => {
      expect(() => {
        // $FlowFixMe
        propertyToSourceGraphQLType();
      }).toThrowError('incorrect Elastic property config');
      expect(() => {
        propertyToSourceGraphQLType({});
      }).toThrowError('incorrect Elastic property config');
    });

    it('should return GraphQLJSON as fallback for unknown Elastic type', () => {
      expect(propertyToSourceGraphQLType({ type: 'strange' })).toEqual(
        GraphQLJSON
      );
    });

    it('should return GraphQLInt for int types', () => {
      expect(propertyToSourceGraphQLType({ type: 'integer' })).toEqual(
        GraphQLInt
      );
      expect(propertyToSourceGraphQLType({ type: 'long' })).toEqual(GraphQLInt);
    });

    it('should return GraphQLString for string types', () => {
      expect(propertyToSourceGraphQLType({ type: 'text' })).toEqual(
        GraphQLString
      );
      expect(propertyToSourceGraphQLType({ type: 'keyword' })).toEqual(
        GraphQLString
      );
    });

    it('should return GraphQLFloat for float types', () => {
      expect(propertyToSourceGraphQLType({ type: 'float' })).toEqual(
        GraphQLFloat
      );
      expect(propertyToSourceGraphQLType({ type: 'double' })).toEqual(
        GraphQLFloat
      );
    });

    it('should return GraphQLBoolean for float types', () => {
      expect(propertyToSourceGraphQLType({ type: 'boolean' })).toEqual(
        GraphQLBoolean
      );
    });

    it('should return GraphQLObjectType for object with subfields', () => {
      const type = propertyToSourceGraphQLType(
        {
          properties: {
            big: {
              type: 'text',
            },
            thumb: {
              type: 'text',
            },
          },
        },
        'ComplexType'
      );
      expect(type).toBeInstanceOf(GraphQLObjectType);
      const tc = TypeComposer.create(type);
      expect(tc.getTypeName()).toEqual('ComplexType');
      expect(tc.getFieldNames()).toEqual(
        expect.arrayContaining(['big', 'thumb'])
      );
      expect(tc.getFieldType('big')).toEqual(GraphQLString);
    });
  });

  describe('inputPropertiesToGraphQLTypes()', () => {
    it('should throw error on incorrect prop', () => {
      expect(() => {
        inputPropertiesToGraphQLTypes({}, () => true);
      }).toThrowError('incorrect Elastic property config');
    });

    it('should convert property to Scalar', () => {
      const fields = inputPropertiesToGraphQLTypes(
        {
          type: 'text',
        },
        () => true,
        'lastname'
      );
      expect(fields._all.lastname).toEqual(GraphQLString);
      expect(fields.text.lastname).toEqual(GraphQLString);
    });

    it('should accept mapping', () => {
      const fields = inputPropertiesToGraphQLTypes(mapping, () => true);
      expect(Object.keys(fields._all).length).toBeGreaterThan(2);
    });

    it('should convert nested fields', () => {
      const fields = inputPropertiesToGraphQLTypes(
        {
          properties: {
            name: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
          },
        },
        () => true
      );
      expect(Object.keys(fields._all).length).toEqual(2);
      expect(Object.keys(fields._all)).toEqual(
        expect.arrayContaining(['name', 'name__keyword'])
      );
      expect(Object.keys(fields.keyword)).toEqual(
        expect.arrayContaining(['name__keyword'])
      );
      expect(Object.keys(fields.text)).toEqual(
        expect.arrayContaining(['name'])
      );
    });

    it('should use filterFn', () => {
      const fields = inputPropertiesToGraphQLTypes(
        {
          properties: {
            name: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 256,
                },
              },
            },
          },
        },
        prop => prop.type !== 'text'
      );
      expect(Object.keys(fields._all).length).toEqual(1);
      expect(Object.keys(fields._all)).toEqual(
        expect.arrayContaining(['name__keyword'])
      );
      expect(Object.keys(fields.keyword).length).toEqual(1);
      expect(Object.keys(fields.keyword)).toEqual(
        expect.arrayContaining(['name__keyword'])
      );
    });

    it('should not return index:false fields', () => {
      const itc = convertToSearchableITC(mapping, 'SearchInput');
      expect(itc.getFieldNames()).not.toEqual(
        expect.arrayContaining(['noIndex'])
      );

      const fields = inputPropertiesToGraphQLTypes(
        {
          properties: {
            name: {
              type: 'text',
              index: false,
            },
            date: {
              type: 'date',
            },
          },
        },
        prop => prop.type !== 'text'
      );
      expect(Object.keys(fields._all).length).toEqual(1);
      expect(Object.keys(fields._all)).toEqual(
        expect.arrayContaining(['date'])
      );
      expect(Object.keys(fields.date).length).toEqual(1);
      expect(Object.keys(fields.date)).toEqual(
        expect.arrayContaining(['date'])
      );
    });
  });

  describe('convertToAggregatableITC()', () => {
    it('should throw error on empty mapping', () => {
      // $FlowFixMe
      expect(() => convertToAggregatableITC()).toThrowError(
        'incorrect mapping'
      );
    });

    it('should throw error on empty typeName', () => {
      expect(() => {
        // $FlowFixMe
        convertToAggregatableITC(mapping);
      }).toThrowError('empty name');
    });

    it('should return InputTypeComposer', () => {
      const itc = convertToAggregatableITC(mapping, 'AggsInput');
      expect(itc).toBeInstanceOf(InputTypeComposer);
      expect(itc.getTypeName()).toBe('AggsInput');
      expect(itc.getFieldNames().length).toBeGreaterThan(1);
    });

    it('should return array of aggregatable fields', () => {
      const itc = convertToAggregatableITC(mapping, 'AggsInput');
      expect(itc.getFieldNames()).toEqual(
        expect.arrayContaining([
          'name__keyword',
          'birthday',
          'avatarUrl__thumb__keyword',
        ])
      );
    });

    it('should not return text fields', () => {
      const itc = convertToAggregatableITC(mapping, 'AggsInput');
      expect(itc.getFieldNames()).not.toEqual(
        expect.arrayContaining(['lastname'])
      );
    });
  });

  describe('convertToSearchableITC()', () => {
    it('should throw error on empty mapping', () => {
      // $FlowFixMe
      expect(() => convertToSearchableITC()).toThrowError('incorrect mapping');
    });

    it('should throw error on empty typeName', () => {
      expect(() => {
        // $FlowFixMe
        convertToSearchableITC(mapping);
      }).toThrowError('empty name');
    });

    it('should return InputTypeComposer', () => {
      const itc = convertToSearchableITC(mapping, 'SearchInput');
      expect(itc).toBeInstanceOf(InputTypeComposer);
      expect(itc.getTypeName()).toBe('SearchInput');
      expect(itc.getFieldNames().length).toBeGreaterThan(1);
    });

    it('should return array of searchable fields', () => {
      const itc = convertToSearchableITC(mapping, 'SearchInput');
      expect(itc.getFieldNames()).toEqual(
        expect.arrayContaining([
          'name__keyword',
          'name',
          'avatarUrl__big',
          'avatarUrl__thumb__keyword',
          'avatarUrl__thumb',
          'lastname',
          'birthday',
        ])
      );
    });
  });

  describe('convertToAnalyzedITC()', () => {
    it('should throw error on empty mapping', () => {
      // $FlowFixMe
      expect(() => convertToAnalyzedITC()).toThrowError('incorrect mapping');
    });

    it('should throw error on empty typeName', () => {
      expect(() => {
        // $FlowFixMe
        convertToAnalyzedITC(mapping);
      }).toThrowError('empty name');
    });

    it('should return InputTypeComposer', () => {
      const itc = convertToAnalyzedITC(mapping, 'AnalyzedInput');
      expect(itc).toBeInstanceOf(InputTypeComposer);
      expect(itc.getTypeName()).toBe('AnalyzedInput');
      expect(itc.getFieldNames().length).toBeGreaterThan(1);
    });

    it('should return array of searchable fields', () => {
      const itc = convertToAnalyzedITC(mapping, 'AnalyzedInput');
      expect(itc.getFieldNames()).toEqual(
        expect.arrayContaining([
          'name',
          'avatarUrl__big',
          'avatarUrl__thumb',
          'lastname',
        ])
      );
    });
  });

  describe('getSubFields()', () => {
    it('should return array of sub fields', () => {
      expect(
        getSubFields('range', ['ok', 'range', 'range.min', 'range.max'])
      ).toEqual(['min', 'max']);
    });

    it('should return array for empty/undefined list', () => {
      expect(getSubFields('range', null)).toEqual([]);
      expect(getSubFields('range')).toEqual([]);
    });
  });
});
