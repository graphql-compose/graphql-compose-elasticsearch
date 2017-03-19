/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getSimpleQueryStringITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QuerySimpleQueryString', opts);
  const description = desc(`
    A query that uses the SimpleQueryParser to parse its context.
    Unlike the regular query_string query, the simple_query_string query
    will never throw an exception, and discards invalid parts of the query.
    Eg. "this AND that OR thus" or "(content:this OR name:this) AND (content:that OR name:that)"
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html)
  `);

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        query: 'String!',
        fields: '[String]',
        default_operator: `enum ${getTypeName('QuerySimpleQueryStringOperatorEnum', opts)} {
          and
          or
        }`,
        analyzer: 'String',
        flags: {
          type: 'String',
          description: desc(`
            Can provided several flags, eg "OR|AND|PREFIX".
            The available flags are: ALL, NONE, AND, OR, NOT, PREFIX, PHRASE,
            PRECEDENCE, ESCAPE, WHITESPACE, FUZZY, NEAR, and SLOP.
          `),
        },
        analyze_wildcard: 'Boolean',
        lenient: 'Boolean',
        minimum_should_match: 'String',
        quote_field_suffix: 'String',
      },
    }));
}
