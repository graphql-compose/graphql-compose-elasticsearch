/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC } from '../Query';
import { getTypeName, getOrSetType, desc } from "../../../utils";

export function getConstantScoreITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryConstantScore', opts);
  const description = desc(`
    A query that wraps another query and simply returns a constant score equal
    to the query boost for every document in the filter.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-constant-score-query.html)
  `);

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        filter: () => getQueryITC(opts).getTypeAsRequired(),
        boost: 'Float!',
      },
    })
  );
}
