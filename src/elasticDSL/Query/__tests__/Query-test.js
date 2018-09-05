/* @flow */

import { schemaComposer, graphql } from 'graphql-compose';
import { getQueryITC } from '../Query';

const { printSchema } = graphql;

beforeEach(() => {
  schemaComposer.clear();
});

describe('AGGS args converter', () => {
  it('Query DSL', () => {
    schemaComposer.Query.addFields({
      search: {
        args: {
          body: {
            type: getQueryITC({
              prefix: 'Elastic_',
              postfix: '_50',
            }),
          },
        },
        type: 'Int',
      },
    });
    const schema = schemaComposer.buildSchema();
    expect(printSchema(schema)).toMatchSnapshot();
  });
});
