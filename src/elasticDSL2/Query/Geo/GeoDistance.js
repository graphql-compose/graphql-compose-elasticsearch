/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from "../../../utils";

export function getGeoDistanceITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryGeoDistance', opts);
  const description = desc(`
    Filters documents that include only hits that exists within
    a specific distance from a geo point. 
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
  `);

  if (false) {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields: {},
      }));
  }

  // $FlowFixMe
  return {
    type: 'JSON',
    description,
  };
}
