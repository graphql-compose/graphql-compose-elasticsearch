import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getParentIdITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('QueryParentId', opts);
  const description = desc(
    `
    The parent_id query can be used to find child documents
    which belong to a particular parent.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-parent-id-query.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      type: 'String',
      id: 'String',
      ignore_unmapped: 'Boolean',
    },
  }));
}
