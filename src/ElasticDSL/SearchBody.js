/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC } from './Query/Query';
import { getTypeName, getOrSetType } from '../utils';

export function getSearchBodyITC(opts = {}): InputTypeComposer {
  const typeName = getTypeName('SearchBody', opts);

  return getOrSetType(typeName, () => {
    const SearchBodyITC = InputTypeComposer.create(typeName);
    SearchBodyITC.setDescription(
      'A query that matches documents matching boolean combinations of other queries. The bool query maps to Lucene BooleanQuery. It is built using one or more boolean clauses, each clause with a typed occurrence. '
    );
    SearchBodyITC.setFields({
      query: () => getQueryITC(opts),
    });

    return SearchBodyITC;
  });
}
