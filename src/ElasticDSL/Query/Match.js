/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getMatchITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryTerm', opts);
  const description = desc(`
    Match Query accept text/numerics/dates, analyzes them, and constructs a query. 
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)
  `);

  if (false) {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields: {},
      }));
  }

  // $FlowFixMe
  return {
    type: 'JSON',
    description,
  };
}
