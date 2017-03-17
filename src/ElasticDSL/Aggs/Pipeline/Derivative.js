/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';

export function getDerivativeITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsDerivative', opts);
  const description = desc(
    `
    A parent pipeline aggregation which calculates the derivative of a specified
    metric in a parent histogram (or date_histogram) aggregation. The specified
    metric must be numeric and the enclosing histogram must have min_doc_count
    set to 0 (default for histogram aggregations).
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-derivative-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        buckets_path: 'String!',
        gap_policy: 'String',
        format: 'String',
        unit: 'String',
      },
    }));
}
