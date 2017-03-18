/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import {
  getGeoPointFC,
  getDistanceUnitFC,
  getDistanceCalculationModeFC,
} from '../../Commons/Geo';
import { getFloatRangeITC } from '../../Commons/Float';
import { getGeoPointFields } from '../../Commons/FieldNames';

export function getGeoDistanceITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsGeoDistance', opts);
  const description = desc(
    `
    A multi-bucket aggregation that works on geo_point fields. The user can
    define a point of origin and a set of distance range buckets.
    The aggregation evaluate the distance of each document value from the
    origin point and determines the buckets it belongs to based on the ranges
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geodistance-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: getGeoPointFields(opts),
        origin: getGeoPointFC(opts),
        ranges: [getFloatRangeITC(opts)],
        unit: getDistanceUnitFC(opts),
        distance_type: getDistanceCalculationModeFC(opts),
      },
    }));
}
