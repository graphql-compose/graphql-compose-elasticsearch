/* @flow */
/* eslint-disable no-unused-vars */

import {
  InputTypeComposer,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../utils';

export function getDateRangeITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('DateRange', opts);
  const description = desc(`Date range where \`from\` value includes and \`to\` value excludes.`);

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      from: getDateMathFC(opts),
      to: getDateMathFC(opts),
    },
  }));
}

export function getDateFormatFC(
  opts: CommonOpts<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: 'String',
    description: desc(
      `
      Date Format/Patter. Eg MM-yyy returns 08-2012.
      [JodaDate](http://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html)
    `
    ),
  };
}

export function getDateIntervalFC(
  opts: CommonOpts<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: 'String',
    description: desc(
      `
      Available expressions for interval: year, quarter, month, week, day, hour,
      minute, second.
      Or time units, like 2d for 2 days. h, m, s, ms, micros, nanos.
    `
    ),
  };
}

export function getDateMathFC(
  opts: CommonOpts<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: 'String',
    description: desc(
      `
      The expression starts with an anchor date, which can either be now,
      or a date string ending with ||. Eg \`2015-01-01||+1M/d\` means 2015-01-01
      plus one month, rounded down to the nearest day. Or \`now+1h+1m\`.
      The supported time units: y, M, w, d, h, m, s
    `
    ),
  };
}

export function getDateTimeZoneFC(
  opts: CommonOpts<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: 'String',
    description: desc(
      `
      Time zones may either be specified as an ISO 8601 UTC offset
      (e.g. +01:00 or -08:00) or as one of the time zone ids from the
      [TZ database](http://www.joda.org/joda-time/timezones.html).
    `
    ),
  };
}
