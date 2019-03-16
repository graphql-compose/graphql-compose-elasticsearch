/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getQueryStringITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('QueryQueryString', opts);
  const description = desc(
    `
    A query that uses a query parser in order to parse its content.
    Eg. "this AND that OR thus" or "(content:this OR name:this) AND (content:that OR name:that)"
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      query: 'String!',
      fields: '[String]',
      default_field: 'String',
      default_operator: `enum ${getTypeName('QueryQueryStringOperatorEnum', opts)} {
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
      tie_breaker: 'Int',
    },
  }));
}
