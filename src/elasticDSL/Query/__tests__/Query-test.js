/* @flow */

import { TypeMapper, graphql } from 'graphql-compose';
import { getQueryITC } from '../Query';

const { printSchema, GraphQLSchema, GraphQLObjectType, GraphQLInt } = graphql;

describe('AGGS args converter', () => {
  it('Query DSL', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
          search: {
            args: TypeMapper.convertArgConfigMap({
              body: {
                type: getQueryITC({
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
});
