/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from "../../../utils";

export function getPercolateITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryPercolate', opts);
  const description = desc(`
    The percolate query can be used to match queries stored in an index.
    The percolate query itself contains the document that will be used
    as query to match with the stored queries.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-percolate-query.html)
  `);

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: 'String!',
        document_type: 'String!',
        document: 'JSON!',
      },
    })
  );
}
