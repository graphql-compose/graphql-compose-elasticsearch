/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getBoolITC } from './Bool';
import { getMatchAllITC } from './MatchAll';
import { getTypeName, getOrSetType } from '../../utils';

export function getQueryITC(opts = {}): InputTypeComposer {
  const typeName = getTypeName('Query', opts);

  return getOrSetType(typeName, () => {
    const QueryITC = InputTypeComposer.create(typeName);
    QueryITC.setFields({
      bool: () => getBoolITC(opts),
      match_all: () => getMatchAllITC(opts),
      term: {
        type: 'JSON',
        description: 'The term query finds documents that contain the exact term specified in the inverted index. { fieldName: value } or { fieldName: { value: value, boost: 2.0 } }',
      },
      terms: {
        type: 'JSON',
        description: 'Filters documents that have fields that match any of the provided terms (not analyzed). { fieldName: [values] }',
      },
      match: {
        type: 'JSON',
        description: '',
      },
    });

    return QueryITC;
  });
}
