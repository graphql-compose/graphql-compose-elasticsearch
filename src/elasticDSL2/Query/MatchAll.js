/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getMatchAllITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryMatchAll', opts);
  const description = desc(
    `
    The most simple query, which matches all documents,
    giving them all a _score of 1.0.
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        boost: {
          type: 'Float',
        },
      },
    }));
}
