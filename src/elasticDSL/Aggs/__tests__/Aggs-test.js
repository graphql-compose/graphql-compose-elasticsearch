/* @flow */

import { TypeMapper, graphql } from 'graphql-compose';
import { getAggsITC, prepareAggsInResolve, convertAggsBlocks, convertAggsRules } from '../Aggs';

const { printSchema, GraphQLSchema, GraphQLObjectType, GraphQLInt } = graphql;

describe('AGGS args converter', () => {
  it('Aggs DSL', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
          search: {
            args: TypeMapper.convertArgConfigMap({
              body: {
                type: getAggsITC({
                  prefix: 'Elastic_',
                  postfix: '_50',
                }),
              },
            }),
            type: GraphQLInt,
          },
        },
      }),
    });
    expect(printSchema(schema)).toMatchSnapshot();
  });

  it('convertAggsRules()', () => {
    expect(convertAggsRules({ some: { field: 1 } })).toEqual({
      some: { field: 1 },
    });
  });

  it('convertAggsBlocks()', () => {
    expect(
      convertAggsBlocks([{ key: 'field1', value: {} }, { key: 'field2', value: {} }])
    ).toEqual({
      field1: {},
      field2: {},
    });
  });

  it('should convert recursively aggs', () => {
    expect(
      convertAggsBlocks([{ key: 'field1', value: { aggs: [{ key: 'field2', value: {} }] } }])
    ).toEqual({ field1: { aggs: { field2: {} } } });
  });

  it('prepareAggsInResolve()', () => {
    expect(
      prepareAggsInResolve([
        { key: 'field1', value: { term: 'a' } },
        { key: 'field2', value: { term: 'b' } },
      ])
    ).toEqual({
      field1: { term: 'a' },
      field2: { term: 'b' },
    });
  });
});
