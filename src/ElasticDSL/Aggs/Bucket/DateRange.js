/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getDateFormatFC, getDateTimeZoneFC } from '../../Commons/Date';

export function getDateRangeITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsDateRange', opts);
  const description = desc(
    `
    A range aggregation that is dedicated for date values. The main difference
    between this aggregation and the normal range aggregation is that
    the from and to values can be expressed in Date Math expressions,
    and it is also possible to specify a date format by which the from
    and to response fields will be returned. Note that this aggregation
    includes the from value and excludes the to value for each range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: 'String',
        format: getDateFormatFC(opts),
        ranges: () => [getDateRangeITC(opts)],
        time_zone: getDateTimeZoneFC(opts),
      },
    }));
}
