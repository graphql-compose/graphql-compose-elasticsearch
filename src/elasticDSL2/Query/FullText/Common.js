/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getCommonITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryCommon', opts);
  const description = desc(
    `
    The common terms query is a modern alternative to stopwords which improves
    the precision and recall of search results (by taking stopwords into account),
    without sacrificing performance.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html)
  `
  );

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
