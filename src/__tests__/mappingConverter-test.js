/* @flow */

import { TypeComposer, GraphQLJSON, GQC } from 'graphql-compose';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  graphql,
} from 'graphql-compose/lib/graphql';
import {
  convertToSourceTC,
  propertyToSourceGraphQLType,
  inputPropertiesToGraphQLTypes,
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
      expect(tc.getFieldNames()).toEqual(expect.arrayContaining(['name', 'avatarUrl']));
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
      expect(propertyToSourceGraphQLType({ type: 'strange' })).toEqual(GraphQLJSON);
    });

    it('should return GraphQLInt for int types', () => {
      expect(propertyToSourceGraphQLType({ type: 'integer' })).toEqual(GraphQLInt);
      expect(propertyToSourceGraphQLType({ type: 'long' })).toEqual(GraphQLInt);
    });

    it('should return GraphQLString for string types', () => {
      expect(propertyToSourceGraphQLType({ type: 'text' })).toEqual(GraphQLString);
      expect(propertyToSourceGraphQLType({ type: 'keyword' })).toEqual(GraphQLString);
    });

    it('should return GraphQLFloat for float types', () => {
      expect(propertyToSourceGraphQLType({ type: 'float' })).toEqual(GraphQLFloat);
      expect(propertyToSourceGraphQLType({ type: 'double' })).toEqual(GraphQLFloat);
    });

    it('should return GraphQLBoolean for float types', () => {
      expect(propertyToSourceGraphQLType({ type: 'boolean' })).toEqual(GraphQLBoolean);
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
      if (type instanceof GraphQLObjectType) {
        const tc = TypeComposer.create(type);
        expect(tc.getTypeName()).toEqual('ComplexType');
        expect(tc.getFieldNames()).toEqual(expect.arrayContaining(['big', 'thumb']));
        expect(tc.getFieldType('big')).toEqual(GraphQLString);
      }
    });
  });

  describe('inputPropertiesToGraphQLTypes()', () => {
    it('should throw error on incorrect prop', () => {
      expect(() => {
        inputPropertiesToGraphQLTypes({});
      }).toThrowError('incorrect Elastic property config');
    });

    it('should convert property to Scalar', () => {
      const fields = inputPropertiesToGraphQLTypes(
        {
          type: 'text',
        },
        'lastname'
      );
      expect(fields._all.lastname).toEqual(GraphQLString);
      expect(fields.text.lastname).toEqual(GraphQLString);
    });

    it('should accept mapping', () => {
      const fields = inputPropertiesToGraphQLTypes(mapping);
      expect(Object.keys(fields._all).length).toBeGreaterThan(2);
    });

    it('should convert nested fields', () => {
      const fields = inputPropertiesToGraphQLTypes({
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
      });
      expect(Object.keys(fields._all).length).toEqual(2);
      expect(Object.keys(fields._all)).toEqual(expect.arrayContaining(['name', 'name__keyword']));
      expect(Object.keys(fields.keyword)).toEqual(expect.arrayContaining(['name__keyword']));
      expect(Object.keys(fields.text)).toEqual(expect.arrayContaining(['name']));
    });

    it('should not return index:false fields', () => {
      const fields = inputPropertiesToGraphQLTypes({
        properties: {
          name: {
            type: 'text',
            index: false,
          },
          date: {
            type: 'date',
          },
        },
      });
      expect(Object.keys(fields._all).length).toEqual(1);
      expect(Object.keys(fields._all)).toEqual(expect.arrayContaining(['date']));
      expect(Object.keys(fields.date).length).toEqual(1);
      expect(Object.keys(fields.date)).toEqual(expect.arrayContaining(['date']));
    });
  });

  describe('getSubFields()', () => {
    it('should return array of sub fields', () => {
      expect(getSubFields('range', ['ok', 'range', 'range.min', 'range.max'])).toEqual([
        'min',
        'max',
      ]);
    });

    it('should return array for empty/undefined list', () => {
      expect(getSubFields('range', null)).toEqual([]);
      expect(getSubFields('range')).toEqual([]);
    });
  });

  describe('issue #9', () => {
    const mapping9 = {
      properties: {
        $id: {
          type: 'long',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
          analyzer: 'email_analyzer',
        },
        $passwordHash: {
          type: 'string',
          index: 'not_analyzed',
        },
      },
    };
    const tc9 = convertToSourceTC(mapping9, 'Type9');

    it('should replace unacceptable characters in GraphQL fieldnames', () => {
      expect(tc9).toBeInstanceOf(TypeComposer);
      expect(tc9.getFieldNames()).toEqual(
        expect.arrayContaining(['_id', 'lastName', 'email', '_passwordHash'])
      );
    });

    it('should work with graphql schema without errors', () => {
      GQC.rootQuery().addFields({ userES: tc9 });
      expect(() => GQC.buildSchema()).not.toThrowError();
    });

    it('should use Elastic field names from source', async () => {
      GQC.rootQuery().addFields({ userES: tc9 });
      const result = await graphql(
        GQC.buildSchema(),
        `
          query {
            userES {
              _id
              lastName
              email
              _passwordHash
            }
          }
        `,
        {
          // simulate elastic responce
          userES: {
            $id: 123,
            lastName: 'Tyler',
            email: 'tyler@example.com',
            $passwordHash: 'abc1234def',
          },
        }
      );
      expect(result).toEqual({
        data: {
          userES: {
            _id: 123,
            lastName: 'Tyler',
            email: 'tyler@example.com',
            _passwordHash: 'abc1234def',
          },
        },
      });
    });
  });
});
