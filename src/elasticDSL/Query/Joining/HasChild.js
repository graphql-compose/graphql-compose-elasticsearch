/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC } from '../Query';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getHasChildITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('QueryHasChild', opts);
  const description = desc(
    `
    The has_child filter accepts a query and the child type to run against,
    and results in parent documents that have child docs matching the query.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-child-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      type: 'String',
      query: () => getQueryITC(opts),
      score_mode: {
        type: 'String',
        description: 'Can be: `avg`, `sum`, `max`, `min`, `none`.',
      },
      min_children: 'Int',
      max_children: 'Int',
    },
  }));
}
