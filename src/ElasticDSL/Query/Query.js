/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getBoolITC } from './Bool';
import { getMatchAllITC } from './MatchAll';
import { getTermITC } from './Term';
import { getTermsITC } from './Terms';
import { getMatchITC } from './Match';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getQueryITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('Query', opts);
  const description = desc(`
    Elasticsearch provides a full Query DSL based on JSON to define queries.
    [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
  `);

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        bool: () => getBoolITC(opts),
        match_all: () => getMatchAllITC(opts),
        term: () => getTermITC(opts),
        terms: () => getTermsITC(opts),
        match: () => getMatchITC(opts),
      },
    })
  );
}
