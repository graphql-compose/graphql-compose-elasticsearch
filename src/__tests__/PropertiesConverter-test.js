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
  propertyToGraphQLType,
  convertToAggregatableITC,
  inputPropertiesToGraphQLTypes,
  convertToSearchableITC,
  convertToAnalyzedITC,
} from '../PropertiesConverter';

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
      const tc = convertToSourceTC(mapping, 'TestMapping');
      const singular: any = tc.getField('name');
      expect(singular.type).toBe(GraphQLString);

      const plural: any = tc.getField('nameA');
      expect(plural.type).toBeInstanceOf(GraphQLList);
      expect(plural.type.ofType).toBe(GraphQLString);
    });
  });

  describe('propertyToGraphQLType()', () => {
    it('should throw error on wrong property config', () => {
      expect(() => {
        // $FlowFixMe
        propertyToGraphQLType();
      }).toThrowError('incorrect Elastic property config');
      expect(() => {
        propertyToGraphQLType({});
      }).toThrowError('incorrect Elastic property config');
    });

    it('should return GraphQLJSON as fallback for unknown Elastic type', () => {
      expect(propertyToGraphQLType({ type: 'strange' })).toEqual(GraphQLJSON);
    });

    it('should return GraphQLInt for int types', () => {
      expect(propertyToGraphQLType({ type: 'integer' })).toEqual(GraphQLInt);
      expect(propertyToGraphQLType({ type: 'long' })).toEqual(GraphQLInt);
    });

    it('should return GraphQLString for string types', () => {
      expect(propertyToGraphQLType({ type: 'text' })).toEqual(GraphQLString);
      expect(propertyToGraphQLType({ type: 'keyword' })).toEqual(GraphQLString);
    });

    it('should return GraphQLFloat for float types', () => {
      expect(propertyToGraphQLType({ type: 'float' })).toEqual(GraphQLFloat);
      expect(propertyToGraphQLType({ type: 'double' })).toEqual(GraphQLFloat);
    });

    it('should return GraphQLBoolean for float types', () => {
      expect(propertyToGraphQLType({ type: 'boolean' })).toEqual(
        GraphQLBoolean
      );
    });

    it('should return GraphQLObjectType for object with subfields', () => {
      const type = propertyToGraphQLType(
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
      expect(fields.lastname).toEqual(GraphQLString);
    });

    it('should accept mapping', () => {
      const fields = inputPropertiesToGraphQLTypes(mapping, () => true);
      expect(Object.keys(fields).length).toBeGreaterThan(2);
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
      expect(Object.keys(fields).length).toEqual(2);
      expect(Object.keys(fields)).toEqual(
        expect.arrayContaining(['name', 'name__keyword'])
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
      expect(Object.keys(fields).length).toEqual(1);
      expect(Object.keys(fields)).toEqual(
        expect.arrayContaining(['name__keyword'])
      );
    });

    it('should not return index:false fields', () => {
      const itc = convertToSearchableITC(mapping, 'SerachInput');
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
      expect(Object.keys(fields).length).toEqual(1);
      expect(Object.keys(fields)).toEqual(
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
      const itc = convertToSearchableITC(mapping, 'SerachInput');
      expect(itc).toBeInstanceOf(InputTypeComposer);
      expect(itc.getTypeName()).toBe('SerachInput');
      expect(itc.getFieldNames().length).toBeGreaterThan(1);
    });

    it('should return array of searchable fields', () => {
      const itc = convertToSearchableITC(mapping, 'SerachInput');
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
});
