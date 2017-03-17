/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getIpRangeTypeITC } from '../../Commons/Ip';

export function getIpRangeITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsIpRange', opts);
  const description = desc(
    `
    A range aggregation that is dedicated for IP values.
    Note that this aggregation includes the \`from\` value and excludes the
    \`to\` value for each range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-iprange-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: 'String',
        ranges: () => [getIpRangeTypeITC(opts)],
      },
    }));
}
