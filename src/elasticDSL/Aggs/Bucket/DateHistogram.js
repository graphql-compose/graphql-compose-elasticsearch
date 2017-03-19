/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';
import {
  getDateIntervalFC,
  getDateFormatFC,
  getDateTimeZoneFC,
} from '../../Commons/Date';
import { getDateFields } from '../../Commons/FieldNames';

export function getDateHistogramITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsDateHistogram', opts);
  const description = desc(
    `
    A multi-bucket aggregation similar to the histogram except it can only
    be applied on date values.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: getDateFields(opts),
        interval: getDateIntervalFC(opts),
        time_zone: getDateTimeZoneFC(opts),
        offset: getDateIntervalFC(opts),
        format: getDateFormatFC(opts),
        missing: 'String',
        script: () => getCommonsScriptITC(opts),
      },
    }));
}
