/* @flow */

import {
  InputTypeComposer,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getGeoPointAsFieldConfigMap } from '../../Commons/FieldNames';
import { getGeoPointFC, getDistanceCalculationModeFC } from '../../Commons/Geo';

export function getGeoDistanceITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const name = getTypeName('QueryGeoDistance', opts);
  const description = desc(
    `
    Filters documents that include only hits that exists within
    a specific distance from a geo point.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
  `
  );

  const subName = getTypeName('QueryGeoDistanceSettings', opts);
  const fields = getGeoPointAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        top_left: getGeoPointFC(opts),
        bottom_right: getGeoPointFC(opts),
      },
    }))
  );

  if (typeof fields === 'object') {
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields: {
        distance: {
          type: 'String!',
          description: 'Eg. 12km',
        },
        distance_type: getDistanceCalculationModeFC(opts),
        ...fields,
        validation_method: 'String',
      },
    }));
  }

  return {
    type: 'JSON',
    description,
  };
}
