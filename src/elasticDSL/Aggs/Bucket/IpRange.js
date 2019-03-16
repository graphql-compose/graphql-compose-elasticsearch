/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getIpRangeTypeITC } from '../../Commons/Ip';
import { getIpFields } from '../../Commons/FieldNames';

export function getIpRangeITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsIpRange', opts);
  const description = desc(
    `
    A range aggregation that is dedicated for IP values.
    Note that this aggregation includes the \`from\` value and excludes the
    \`to\` value for each range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-iprange-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getIpFields(opts),
      ranges: () => [getIpRangeTypeITC(opts)],
    },
  }));
}
