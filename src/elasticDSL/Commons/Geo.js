/* @flow */
/* eslint-disable no-unused-vars */

import {
  InputTypeComposer,
  graphql,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../utils';

const { GraphQLScalarType, Kind } = graphql;

export const ElasticGeoPointType = new GraphQLScalarType({
  name: 'ElasticGeoPointType',
  description: desc(
    `
    Elastic Search GeoPoint Type.
    Object format: { "lat" : 52.3760, "lon" : 4.894 }.
    String format (lat, lon): "52.3760, 4.894".
    Array GeoJson format (lat, lon): [4.894, 52.3760]
  `
  ),
  serialize: v => v,
  parseValue: v => v,
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return ast.value;
      case Kind.OBJECT: {
        let lat;
        let lon;
        ast.fields.forEach(field => {
          if (field.name.value === 'lat') {
            lat = parseFloat(field.value);
          }
          if (field.name.value === 'lon') {
            lon = parseFloat(field.value);
          }
        });
        return { lat, lon };
      }
      case Kind.LIST:
        if (ast.values.length === 2) {
          return [parseFloat(ast.values[0].value || 0), parseFloat(ast.values[1].value || 0)];
        }
        return null;
      default:
        return null;
    }
  },
});

export function getGeoPointFC(opts: CommonOpts<any>): GraphQLScalarType {
  return ElasticGeoPointType;
}

export function getDistanceUnitFC(
  opts: CommonOpts<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: 'String',
    description: desc(
      `
      By default, the distance unit is m (metres) but it can also accept:
      mi (miles), in (inches), yd (yards), km (kilometers), cm (centimeters),
      mm (millimeters).
    `
    ),
  };
}

export function getDistanceCalculationModeFC(
  opts: CommonOpts<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: 'String',
    description: desc(
      `
      \`sloppy_arc\` (the default)
      \`arc\` (most accurate) for very large areas like cross continent search.
      \`plane\` (fastest) for smaller geographical areas like cities or even countries.
    `
    ),
  };
}
