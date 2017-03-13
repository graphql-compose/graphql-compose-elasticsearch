/* @flow */
import { printSchema, GraphQLSchema, GraphQLObjectType, GraphQLInt } from 'graphql';
import { getQueryITC } from './Query';

describe('Elastic DSL Query', () => {
  it('should match', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
          search: {
            args: {
              body: {
                type: getQueryITC({ prefix: 'Elastic_', postfix: '_50' }).getType(),
              },
            },
            type: GraphQLInt,
          },
        },
      }),
    });
    expect(printSchema(schema)).toMatchSnapshot();
  });
});
