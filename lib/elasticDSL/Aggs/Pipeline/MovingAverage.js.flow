/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getMovingAverageITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsMovingAverage', opts);
  const description = desc(
    `
    Given an ordered series of data, the Moving Average aggregation will slide
    a window across the data and emit the average value of that window.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movavg-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        buckets_path: 'String!',
        format: 'String',
        window: 'Int',
        gap_policy: 'String',
        model: 'String',
        settings: 'JSON',
      },
    })
  );
}
