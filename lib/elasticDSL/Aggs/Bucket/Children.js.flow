/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getChildrenITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsChildren', opts);
  const description = desc(
    `
    A special single bucket aggregation that enables aggregating from buckets
    on parent document types to buckets on child documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-children-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        type: 'String',
      },
    })
  );
}
