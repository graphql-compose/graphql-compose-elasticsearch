/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC } from '../Query';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getHasParentITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryHasParent', opts);
  const description = desc(
    `
    The has_parent query accepts a query and a parent type. The query is executed
    in the parent document space, which is specified by the parent type
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-has-parent-query.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        parent_type: 'String',
        query: () => getQueryITC(opts),
        score: 'Boolean',
        ignore_unmapped: 'Boolean',
      },
    }));
}
