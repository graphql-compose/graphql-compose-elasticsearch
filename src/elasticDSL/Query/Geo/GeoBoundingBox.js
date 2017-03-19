/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from "../../../utils";

export function getGeoBoundingBoxITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryGeoBoundingBox', opts);
  const description = desc(`
    A query allowing to filter hits based on a point location using a bounding box.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-bounding-box-query.html)
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
