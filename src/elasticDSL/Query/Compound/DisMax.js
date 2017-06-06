/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC, prepareQueryInResolve } from '../Query';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getDisMaxITC(opts: mixed = {}): InputTypeComposer {
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

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        queries: () => [getQueryITC(opts)],
        boost: 'Float',
        tie_breaker: 'Float',
      },
    })
  );
}

/* eslint-disable no-param-reassign, camelcase */
export function prepareDisMaxResolve(dis_max: any, fieldMap: mixed): { [argName: string]: any } {
  if (Array.isArray(dis_max.queries)) {
    dis_max.queries = dis_max.queries.map(query => prepareQueryInResolve(query, fieldMap));
  }

  return dis_max;
}
