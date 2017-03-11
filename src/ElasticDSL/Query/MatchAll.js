/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../../utils';

export function getMatchAllITC(opts = {}): InputTypeComposer {
  const typeName = getTypeName('QueryMatchAll', opts);

  return getOrSetType(typeName, () => {
    const MatchAllITC = InputTypeComposer.create(typeName);
    MatchAllITC.setDescription('The most simple query, which matches all documents, giving them all a _score of 1.0.');
    MatchAllITC.setFields({
      boost: {
        type: 'Float',
      },
    });

    return MatchAllITC;
  });
}
