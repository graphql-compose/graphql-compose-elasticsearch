/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getGeoPointFields } from '../../Commons/FieldNames';

export function getGeoCentroidITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsGeoCentroid', opts);
  const description = desc(
    `
    A metric aggregation that computes the weighted centroid from all coordinate
    values for a Geo-point datatype field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geocentroid-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: getGeoPointFields(opts),
      },
    })
  );
}
