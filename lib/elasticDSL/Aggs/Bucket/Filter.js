"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterITC = getFilterITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../../../utils");

var _Query = require("../../Query/Query");

/* eslint-disable no-unused-vars */
function getFilterITC(opts = {}) {
  const name = (0, _utils.getTypeName)('AggsFilter', opts);
  const description = (0, _utils.desc)(`
    Defines a single bucket of all the documents in the current document set
    context that match a specified filter. Often this will be used to narrow
    down the current aggregation context to a specific set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-filter-aggregation.html)
  `);
  return (0, _Query.getQueryITC)(opts);
}