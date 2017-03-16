/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getGeoBoundsITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsGeoBounds', opts);
  const description = desc(
    `
    A metric aggregation that computes the bounding box containing
    all geo_point values for a field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geobounds-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: 'String!',
        wrap_longitude: 'Boolean',
      },
    }));
}
