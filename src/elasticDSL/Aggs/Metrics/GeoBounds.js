/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getGeoPointFields } from '../../Commons/FieldNames';

export function getGeoBoundsITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsGeoBounds', opts);
  const description = desc(
    `
    A metric aggregation that computes the bounding box containing
    all geo_point values for a field.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-geobounds-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getGeoPointFields(opts),
      wrap_longitude: 'Boolean',
    },
  }));
}
