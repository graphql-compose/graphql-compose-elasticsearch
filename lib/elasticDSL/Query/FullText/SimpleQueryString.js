"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSimpleQueryStringITC = getSimpleQueryStringITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getSimpleQueryStringITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QuerySimpleQueryString', opts);
  const description = (0, _utils.desc)(`
    A query that uses the SimpleQueryParser to parse its context.
    Unlike the regular query_string query, the simple_query_string query
    will never throw an exception, and discards invalid parts of the query.
    Eg. "this AND that OR thus" or "(content:this OR name:this) AND (content:that OR name:that)"
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      query: 'String!',
      fields: '[String]',
      default_operator: `enum ${(0, _utils.getTypeName)('QuerySimpleQueryStringOperatorEnum', opts)} {
          and
          or
        }`,
      analyzer: 'String',
      flags: {
        type: 'String',
        description: (0, _utils.desc)(`
            Can provided several flags, eg "OR|AND|PREFIX".
            The available flags are: ALL, NONE, AND, OR, NOT, PREFIX, PHRASE,
            PRECEDENCE, ESCAPE, WHITESPACE, FUZZY, NEAR, and SLOP.
          `)
      },
      analyze_wildcard: 'Boolean',
      lenient: 'Boolean',
      minimum_should_match: 'String',
      quote_field_suffix: 'String',
      boost: 'Float'
    }
  }));
}