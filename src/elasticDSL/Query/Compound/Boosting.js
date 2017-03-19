/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC, prepareQueryInResolve } from '../Query';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getBoostingITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryBoosting', opts);
  const description = desc(
    `
    The boosting query can be used to effectively demote results that match a given query.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-boosting-query.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        positive: () => getQueryITC(opts),
        negative: () => getQueryITC(opts),
        negative_boost: 'Float',
      },
    }));
}

export function prepareBoostingInResolve(
  boosting: any,
  fieldMap: mixed
): { [argName: string]: any } {
  /* eslint-disable no-param-reassign */
  if (boosting.positive) {
    boosting.positive = prepareQueryInResolve(boosting.positive, fieldMap);
  }
  if (boosting.negative) {
    boosting.negative = prepareQueryInResolve(boosting.negative, fieldMap);
  }

  return boosting;
}
