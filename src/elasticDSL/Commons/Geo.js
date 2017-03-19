/* @flow */
/* eslint-disable no-unused-vars */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getGeoPointFC(opts: mixed = {}): mixed {
  return {
    type: 'String',
    description: desc(
      `
      Object format: { "lat" : 52.3760, "lon" : 4.894 }.
      String format (lat, lon): "52.3760, 4.894".
      Array GeoJson format (lat, lon): [4.894, 52.3760]
    `
    ),
  };
}

export function getDistanceUnitFC(opts: mixed = {}): mixed {
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

export function getDistanceCalculationModeFC(opts: mixed = {}): mixed {
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
