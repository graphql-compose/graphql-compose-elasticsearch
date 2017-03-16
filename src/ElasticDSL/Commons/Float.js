/* @flow */
/* eslint-disable no-unused-vars */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getFloatRangeITC(opts: mixed = {}): mixed {
  const name = getTypeName('FloatRange', opts);
  const description = desc(
    `Float range where \`from\` value includes and \`to\` value excludes.`
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        from: 'Float',
        to: 'Float',
      },
    }));
}
