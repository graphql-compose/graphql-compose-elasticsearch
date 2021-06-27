import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC, prepareQueryInResolve } from '../Query';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getDisMaxITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('QueryDisMax', opts);
  const description = desc(
    `
    A query that generates the union of documents produced by its subqueries,
    and that scores each document with the maximum score for that document
    as produced by any subquery, plus a tie breaking increment
    for any additional matching subqueries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-dis-max-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      queries: (): InputTypeComposer<TContext>[] => [getQueryITC(opts)],
      boost: 'Float',
      tie_breaker: 'Float',
    },
  }));
}

/* eslint-disable no-param-reassign, camelcase */
export function prepareDisMaxResolve(dis_max: any, fieldMap: any): { [argName: string]: any } {
  if (Array.isArray(dis_max.queries)) {
    dis_max.queries = dis_max.queries.map((query: any) => prepareQueryInResolve(query, fieldMap));
  }

  return dis_max;
}
