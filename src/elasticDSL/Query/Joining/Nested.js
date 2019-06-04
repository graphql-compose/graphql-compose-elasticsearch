/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC } from '../Query';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getNestedITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('QueryNested', opts);
  const description = desc(
    `
    Nested query allows to query nested objects / docs. The query is executed
    against the nested objects / docs as if they were indexed as separate docs.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-nested-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      path: 'String',
      score_mode: {
        type: 'String',
        description: 'Can be: `avg`, `sum`, `max`, `min`, `none`.',
      },
      query: (): InputTypeComposer<TContext> => getQueryITC(opts),
    },
  }));
}
