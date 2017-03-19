/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC, prepareQueryInResolve } from '../Query';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getBoolITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryBool', opts);
  const description = desc(
    `
    A query that matches documents matching boolean combinations
    of other queries. The bool query maps to Lucene BooleanQuery.
    It is built using one or more boolean clauses, each clause
    with a typed occurrence.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        must: {
          type: () => getQueryITC(opts),
          description: desc(
            `
            The clause (query) must appear in matching documents
            and will contribute to the score.
          `
          ),
        },
        filter: {
          type: () => getQueryITC(opts),
          description: desc(
            `
            The clause (query) must appear in matching documents.
            However unlike must the score of the query will be ignored.
            Filter clauses are executed in filter context, meaning
            that scoring is ignored and clauses are considered for caching.
          `
          ),
        },
        should: {
          type: () => getQueryITC(opts),
          description: desc(
            `
            The clause (query) should appear in the matching document.
            In a boolean query with no must or filter clauses,
            one or more should clauses must match a document.
            The minimum number of should clauses to match can be set
            using the minimum_should_match parameter.
          `
          ),
        },
        minimum_should_match: {
          type: 'String',
          description: desc(
            `
            The minimum number of should clauses to match.
          `
          ),
        },
        must_not: {
          type: () => getQueryITC(opts),
          description: desc(
            `
            The clause (query) must not appear in the matching documents.
            Clauses are executed in filter context meaning that scoring
            is ignored and clauses are considered for caching.
            Because scoring is ignored, a score of 0 for all documents
            is returned.
          `
          ),
        },
        boost: 'Float',
      },
    }));
}

export function prepareBoolInResolve(
  bool: any,
  fieldMap: mixed
): { [argName: string]: any } {
  /* eslint-disable no-param-reassign */
  if (bool.must) {
    bool.must = prepareQueryInResolve(bool.must, fieldMap);
  }
  if (bool.filter) {
    bool.filter = prepareQueryInResolve(bool.filter, fieldMap);
  }
  if (bool.should) {
    bool.should = prepareQueryInResolve(bool.should, fieldMap);
  }
  if (bool.must_not) {
    bool.must_not = prepareQueryInResolve(bool.must_not, fieldMap);
  }

  return bool;
}
