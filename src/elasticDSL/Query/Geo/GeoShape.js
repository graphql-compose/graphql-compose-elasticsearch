/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from "../../../utils";

export function getGeoShapeITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryGeoShape', opts);
  const description = desc(`
    Filter documents indexed using the geo_shape type.
    Requires the geo_shape Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html)
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
