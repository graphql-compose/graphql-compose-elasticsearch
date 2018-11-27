"use strict";

var _graphqlCompose = require("graphql-compose");

var _Aggs = require("../Aggs");

const printSchema = _graphqlCompose.graphql.printSchema;
beforeEach(() => {
  _graphqlCompose.schemaComposer.clear();
});
describe('AGGS args converter', () => {
  it('Aggs DSL', () => {
    _graphqlCompose.schemaComposer.Query.addFields({
      search: {
        args: {
          body: {
            type: (0, _Aggs.getAggsITC)({
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
  it('convertAggsRules()', () => {
    expect((0, _Aggs.convertAggsRules)({
      some: {
        field: 1
      }
    })).toEqual({
      some: {
        field: 1
      }
    });
  });
  it('convertAggsBlocks()', () => {
    expect((0, _Aggs.convertAggsBlocks)([{
      key: 'field1',
      value: {}
    }, {
      key: 'field2',
      value: {}
    }])).toEqual({
      field1: {},
      field2: {}
    });
  });
  it('should convert recursively aggs', () => {
    expect((0, _Aggs.convertAggsBlocks)([{
      key: 'field1',
      value: {
        aggs: [{
          key: 'field2',
          value: {}
        }]
      }
    }])).toEqual({
      field1: {
        aggs: {
          field2: {}
        }
      }
    });
  });
  it('prepareAggsInResolve()', () => {
    expect((0, _Aggs.prepareAggsInResolve)([{
      key: 'field1',
      value: {
        term: 'a'
      }
    }, {
      key: 'field2',
      value: {
        term: 'b'
      }
    }])).toEqual({
      field1: {
        term: 'a'
      },
      field2: {
        term: 'b'
      }
    });
  });
});