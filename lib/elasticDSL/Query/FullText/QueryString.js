"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryStringITC = getQueryStringITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getQueryStringITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryQueryString', opts);
  const description = (0, _utils.desc)(`
    A query that uses a query parser in order to parse its content.
    Eg. "this AND that OR thus" or "(content:this OR name:this) AND (content:that OR name:that)"
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      query: 'String!',
      fields: '[String]',
      default_field: 'String',
      default_operator: `enum ${(0, _utils.getTypeName)('QueryQueryStringOperatorEnum', opts)} {
          and
          or
        }`,
      analyzer: 'String',
      allow_leading_wildcard: 'Boolean',
      enable_position_increments: 'Boolean',
      fuzzy_max_expansions: 'Int',
      fuzziness: 'String',
      fuzzy_prefix_length: 'Int',
      phrase_slop: 'Int',
      boost: 'Float',
      auto_generate_phrase_queries: 'Boolean',
      analyze_wildcard: 'Boolean',
      max_determinized_states: 'Int',
      minimum_should_match: 'String',
      lenient: 'Boolean',
      time_zone: 'String',
      quote_field_suffix: 'String',
      split_on_whitespace: 'Boolean',
      use_dis_max: 'Boolean',
      tie_breaker: 'Int'
    }
  }));
}