/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import type { GraphQLFieldResolver } from 'graphql/type/definition';
import { getQueryITC } from './Query/Query';
import { getAggBlockITC } from './Aggs/AggBlock';
import prepareArgAggs from './Aggs/converter';
import { getTypeName, getOrSetType, desc } from '../utils';

export function getSearchBodyITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('SearchBody', opts);
  const description = desc(
    `
    The search request can be executed with a search DSL, which includes
    the [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html),
    within its body.
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        query: () => getQueryITC(opts),
        aggs: () => [getAggBlockITC(opts)],
        size: 'Int',
      },
    }));
}

export function prepareSearchArgs(
  resolve: GraphQLFieldResolver<*, *>
): GraphQLFieldResolver<*, *> {
  return prepareArgAggs(resolve);
}
