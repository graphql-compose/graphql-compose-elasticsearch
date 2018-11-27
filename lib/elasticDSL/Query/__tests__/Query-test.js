"use strict";

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

const printSchema = _graphqlCompose.graphql.printSchema;
beforeEach(() => {
  _graphqlCompose.schemaComposer.clear();
});
describe('AGGS args converter', () => {
  it('Query DSL', () => {
    _graphqlCompose.schemaComposer.Query.addFields({
      search: {
        args: {
          body: {
            type: (0, _Query.getQueryITC)({
              prefix: 'Elastic_',
              postfix: '_50'
            })
          }
        },
        type: 'Int'
      }
    });

    const schema = _graphqlCompose.schemaComposer.buildSchema();

    expect(printSchema(schema)).toMatchSnapshot();
  });
});