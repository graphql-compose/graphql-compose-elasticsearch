import { InputTypeComposer, InputTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';
import { getGeoPointAsFieldConfigMap } from '../../Commons/FieldNames';
import { getGeoPointFC } from '../../Commons/Geo';

export function getGeoPolygonITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | InputTypeComposerFieldConfigAsObjectDefinition {
  const name = getTypeName('QueryGeoPolygon', opts);
  const description = desc(
    `
    A query allowing to include hits that only fall within a polygon of points.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-polygon-query.html)
  `
  );

  const subName = getTypeName('QueryGeoPolygonSettings', opts);
  const fields = getGeoPointAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        points: [getGeoPointFC(opts)],
        validation_method: 'String',
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
