/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getTopHitsITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsTopHits', opts);
  const description = desc(
    `
    A top_hits metric aggregator keeps track of the most relevant document being
    aggregated. This aggregator is intended to be used as a sub aggregator,
    so that the top matching documents can be aggregated per bucket.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-top-hits-aggregation.html#search-aggregations-metrics-top-hits-aggregation)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
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
