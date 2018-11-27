"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMultiMatchITC = getMultiMatchITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

function getMultiMatchITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryMultiMatch', opts);
  const description = (0, _utils.desc)(`
    The multi_match query builds on the match query to allow multi-field queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      query: 'String!',
      fields: {
        type: '[String]!',
        description: (0, _utils.desc)(`
            Array of fields [ "title", "*_name", "subject^3" ].
            You may use wildcards and boosting field.
          `)
      },
      type: `enum ${(0, _utils.getTypeName)('QueryMultiMatchTypeEnum', opts)} {
          best_fields
          most_fields
          cross_fields
          phrase
          phrase_prefix
        }`,
      operator: `enum ${(0, _utils.getTypeName)('QueryMultiMatchOperatorEnum', opts)} {
          and
          or
        }`,
      minimum_should_match: 'String',
      analyzer: 'String',
      slop: 'Int',
      boost: 'Float',
      fuzziness: 'JSON',
      prefix_length: 'Int',
      max_expansions: 'Int',
      rewrite: 'String',
      zero_terms_query: 'JSON',
      cutoff_frequency: 'Float' // lenient: 'JSON', // depricated from ES 5.3

    }
  }));
}