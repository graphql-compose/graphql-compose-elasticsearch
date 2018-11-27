"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateRangeITC = getDateRangeITC;
exports.getDateFormatFC = getDateFormatFC;
exports.getDateIntervalFC = getDateIntervalFC;
exports.getDateMathFC = getDateMathFC;
exports.getDateTimeZoneFC = getDateTimeZoneFC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../utils");

/* eslint-disable no-unused-vars */
function getDateRangeITC(opts = {}) {
  const name = (0, _utils.getTypeName)('DateRange', opts);
  const description = (0, _utils.desc)(`Date range where \`from\` value includes and \`to\` value excludes.`);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      from: getDateMathFC(),
      to: getDateMathFC()
    }
  }));
}

function getDateFormatFC(opts = {}) {
  return {
    type: 'String',
    description: (0, _utils.desc)(`
      Date Format/Patter. Eg "MM-yyy" returns "08-2012".
      [JodaDate](http://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html)
    `)
  };
}

function getDateIntervalFC(opts = {}) {
  return {
    type: 'String',
    description: (0, _utils.desc)(`
      Available expressions for interval: year, quarter, month, week, day, hour,
      minute, second.
      Or time units, like 2d for 2 days. h, m, s, ms, micros, nanos.
    `)
  };
}

function getDateMathFC(opts = {}) {
  return {
    type: 'String',
    description: (0, _utils.desc)(`
      The expression starts with an anchor date, which can either be now,
      or a date string ending with ||. Eg \`2015-01-01||+1M/d\` means 2015-01-01
      plus one month, rounded down to the nearest day. Or \`now+1h+1m\`.
      The supported time units: y, M, w, d, h, m, s
    `)
  };
}

function getDateTimeZoneFC(opts = {}) {
  return {
    type: 'String',
    description: (0, _utils.desc)(`
      Time zones may either be specified as an ISO 8601 UTC offset
      (e.g. +01:00 or -08:00) or as one of the time zone ids from the
      [TZ database](http://www.joda.org/joda-time/timezones.html).
    `)
  };
}