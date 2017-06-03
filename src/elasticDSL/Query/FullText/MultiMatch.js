/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getMultiMatchITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryMultiMatch', opts);
  const description = desc(
    `
    The multi_match query builds on the match query to allow multi-field queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        query: 'String!',
        fields: {
          type: '[String]!',
          description: desc(
            `
            Array of fields [ "title", "*_name", "subject^3" ].
            You may use wildcards and boosting field.
          `
          ),
        },
        type: `enum ${getTypeName('QueryMultiMatchTypeEnum', opts)} {
          best_fields
          most_fields
          cross_fields
          phrase
          phrase_prefix
        }`,
        operator: `enum ${getTypeName('QueryMultiMatchOperatorEnum', opts)} {
          and
          or
        }`,
        minimum_should_match: 'String',
        analyzer: 'String',
      },
    })
  );
}
