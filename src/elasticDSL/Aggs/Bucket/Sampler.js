/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';

export function getSamplerITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsSampler', opts);
  const description = desc(
    `
    A filtering aggregation used to limit any sub aggregations' processing
    to a sample of the top-scoring documents.
    Tightening the focus of analytics to high-relevance matches rather than
    the potentially very long tail of low-quality matches.
    This functionality is experimental and may be changed or removed completely.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-sampler-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      shard_size: 'Int',
    },
  }));
}
