/* @flow */

import {
  printSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';
import { TypeMapper } from 'graphql-compose';
import { getQueryITC } from '../Query';

describe('AGGS args converter', () => {
  it('Query DSL', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
          search: {
            // $FlowFixMe
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
