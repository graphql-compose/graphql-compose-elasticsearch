import { ObjectTypeComposer, schemaComposer, graphql } from 'graphql-compose';
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

beforeEach(() => {
  schemaComposer.clear();
});

describe('PropertiesConverter', () => {
  describe('convertToSourceTC(schemaComposer, )', () => {
    it('should throw error on empty mapping', () => {
      expect(() => {
        // @ts-expect-error
        convertToSourceTC(schemaComposer);
      }).toThrowError('incorrect mapping');
    });

    it('should throw error on empty typeName', () => {
      expect(() => {
        // @ts-expect-error
        convertToSourceTC(schemaComposer, mapping);
      }).toThrowError('empty name');
    });

    it('should return ObjectTypeComposer', () => {
      const tc = convertToSourceTC(schemaComposer, mapping, 'TestMapping');
      expect(tc).toBeInstanceOf(ObjectTypeComposer);
      expect(tc.getTypeName()).toBe('TestMapping');
      expect(tc.getFieldNames()).toEqual(expect.arrayContaining(['name', 'avatarUrl']));
    });

    it('should make singular and plural fields', () => {
      const tc1 = convertToSourceTC(schemaComposer, mapping, 'TestMapping');
      const singular: any = tc1.getFieldTC('name');
      expect(singular.getTypeName()).toBe('String');

      const tc2 = convertToSourceTC(schemaComposer, mapping, 'TestMapping', {
        pluralFields: ['name'],
      });
      const plural: any = tc2.getField('name');
      expect(plural.type.getTypeName()).toEqual('[String]');
    });
  });

  describe('propertyToSourceGraphQLType(schemaComposer, )', () => {
    it('should throw error on wrong property config', () => {
      expect(() => {
        // @ts-expect-error
        propertyToSourceGraphQLType(schemaComposer);
      }).toThrowError('incorrect Elastic property config');
      expect(() => {
        propertyToSourceGraphQLType(schemaComposer, {});
      }).toThrowError('incorrect Elastic property config');
    });

    it('should return GraphQLJSON as fallback for unknown Elastic type', () => {
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'strange' })).toEqual('JSON');
    });

    it('should return GraphQLInt for int types', () => {
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'integer' })).toEqual('Int');
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'long' })).toEqual('Int');
    });

    it('should return String for string types', () => {
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'text' })).toEqual('String');
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'keyword' })).toEqual('String');
    });

    it('should return Float for float types', () => {
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'float' })).toEqual('Float');
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'double' })).toEqual('Float');
    });

    it('should return Boolean for float types', () => {
      expect(propertyToSourceGraphQLType(schemaComposer, { type: 'boolean' })).toEqual('Boolean');
    });

    it('should return GraphQLObjectType for object with subfields', () => {
      const tc: any = propertyToSourceGraphQLType(
        schemaComposer,
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
      expect(tc).toBeInstanceOf(ObjectTypeComposer);
      expect(tc.getTypeName()).toEqual('ComplexType');
      expect(tc.getFieldNames()).toEqual(expect.arrayContaining(['big', 'thumb']));
      expect(tc.getFieldTC('big').getTypeName()).toEqual('String');
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
      expect(fields._all.lastname).toEqual('String');
      expect(fields.text.lastname).toEqual('String');
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
                // ignore_above: 256,
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
    const tc9 = convertToSourceTC(schemaComposer, mapping9, 'Type9');

    it('should replace unacceptable characters in GraphQL fieldnames', () => {
      expect(tc9).toBeInstanceOf(ObjectTypeComposer);
      expect(tc9.getFieldNames()).toEqual(
        expect.arrayContaining(['_id', 'lastName', 'email', '_passwordHash'])
      );
    });

    it('should work with graphql schema without errors', () => {
      schemaComposer.Query.addFields({ userES: tc9 });
      expect(() => schemaComposer.buildSchema()).not.toThrowError();
    });

    it('should use Elastic field names from source', async () => {
      schemaComposer.Query.addFields({ userES: tc9 });
      const result = await graphql.graphql(
        schemaComposer.buildSchema(),
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
