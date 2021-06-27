import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getTopHitsITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsTopHits', opts);
  const description = desc(
    `
    A top_hits metric aggregator keeps track of the most relevant document being
    aggregated. This aggregator is intended to be used as a sub aggregator,
    so that the top matching documents can be aggregated per bucket.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-top-hits-aggregation.html#search-aggregations-metrics-top-hits-aggregation)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      from: 'Int',
      size: 'Int',
      sort: 'JSON',
      _source: 'JSON',
    },
  }));
}
