/* @flow */

import {
  InputTypeComposer,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getGeoShapeAsFieldConfigMap } from '../../Commons/FieldNames';

export function getGeoShapeITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const name = getTypeName('QueryGeoShape', opts);
  const description = desc(
    `
    Filter documents indexed using the geo_shape type.
    Requires the geo_shape Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-shape-query.html)
  `
  );

  const subName = getTypeName('QueryGeoShapeSettings', opts);
  const fields = getGeoShapeAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        shape: 'JSON',
        relation: 'JSON',
        indexed_shape: 'JSON',
      },
    }))
  );

  if (typeof fields === 'object') {
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields,
    }));
  }

  return {
    type: 'JSON',
    description,
  };
}
