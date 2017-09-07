/* @flow */

import { TypeMapper } from 'graphql-compose';
import {
  printSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql-compose/lib/graphql';
import { getQueryITC } from '../Query';

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
