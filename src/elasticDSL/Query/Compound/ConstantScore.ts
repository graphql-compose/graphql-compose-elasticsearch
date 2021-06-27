import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC, prepareQueryInResolve } from '../Query';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getConstantScoreITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('QueryConstantScore', opts);
  const description = desc(
    `
    A query that wraps another query and simply returns a constant score equal
    to the query boost for every document in the filter.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      filter: () => getQueryITC(opts).getTypeNonNull(),
      boost: 'Float!',
    },
  }));
}

/* eslint-disable no-param-reassign, camelcase */
export function prepareConstantScoreInResolve(
  constant_score: any,
  fieldMap: any
): { [argName: string]: any } {
  if (constant_score.filter) {
    constant_score.filter = prepareQueryInResolve(constant_score.filter, fieldMap);
  }

  return constant_score;
}
