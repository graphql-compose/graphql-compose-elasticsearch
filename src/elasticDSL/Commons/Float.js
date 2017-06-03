/* @flow */
/* eslint-disable no-unused-vars */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getFloatRangeITC(opts: mixed = {}): mixed {
  const name = getTypeName('FloatRange', opts);
  const description = desc(`Float range where \`from\` value includes and \`to\` value excludes.`);

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        from: 'Float',
        to: 'Float',
      },
    })
  );
}

export function getFloatRangeKeyedITC(opts: mixed = {}): mixed {
  const name = getTypeName('FloatRangeKeyed', opts);
  const description = desc(
    `
    Float range where \`from\` value includes and \`to\` value excludes and
    may have a key for aggregation.
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        from: 'Float',
        to: 'Float',
        key: 'String',
      },
    })
  );
}
