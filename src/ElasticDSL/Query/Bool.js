/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC } from './Query';
import { getTypeName, getOrSetType } from "../../utils";

export function getBoolITC(opts = {}): InputTypeComposer {
  const typeName = getTypeName('QueryBool', opts);

  return getOrSetType(typeName, () => {
    const BoolITC = InputTypeComposer.create(typeName);
    BoolITC.setDescription('A query that matches documents matching boolean combinations of other queries. The bool query maps to Lucene BooleanQuery. It is built using one or more boolean clauses, each clause with a typed occurrence. ');
    BoolITC.setFields({
      must: {
        type: () => getQueryITC(opts),
        description: 'The clause (query) must appear in matching documents and will contribute to the score.',
      },
      filter: {
        type: () => getQueryITC(opts),
        description: 'The clause (query) must appear in matching documents. However unlike must the score of the query will be ignored. Filter clauses are executed in filter context, meaning that scoring is ignored and clauses are considered for caching.',
      },
      should: {
        type: () => getQueryITC(opts),
        description: 'The clause (query) should appear in the matching document. In a boolean query with no must or filter clauses, one or more should clauses must match a document. The minimum number of should clauses to match can be set using the minimum_should_match parameter.',
      },
      minimum_should_match: {
        type: 'Int',
        description: 'The minimum number of should clauses to match can be set using the minimum_should_match parameter.',
      },
      must_not: {
        type: () => getQueryITC(opts),
        description: 'The clause (query) must not appear in the matching documents. Clauses are executed in filter context meaning that scoring is ignored and clauses are considered for caching. Because scoring is ignored, a score of 0 for all documents is returned.',
      },
      boost: {
        type: 'Float',
      },
    });

    return BoolITC;
  });
}
