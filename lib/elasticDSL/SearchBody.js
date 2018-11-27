"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchBodyITC = getSearchBodyITC;
exports.prepareBodyInResolve = prepareBodyInResolve;

var _graphqlCompose = require("graphql-compose");

var _Query = require("./Query/Query");

var _Aggs = require("./Aggs/Aggs");

var _Sort = require("./Sort");

var _utils = require("../utils");

function getSearchBodyITC(opts = {}) {
  const name = (0, _utils.getTypeName)('SearchBody', opts);
  const description = (0, _utils.desc)(`
    Request Body Search
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-body.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      query: () => (0, _Query.getQueryITC)(opts),
      aggs: () => (0, _Aggs.getAggsITC)(opts),
      size: 'Int',
      from: 'Int',
      sort: () => [(0, _Sort.getSortITC)(opts)],
      _source: 'JSON',
      script_fields: 'JSON',
      post_filter: () => (0, _Query.getQueryITC)(opts),
      highlight: 'JSON',
      search_after: 'JSON',
      explain: 'Boolean',
      version: 'Boolean',
      indices_boost: 'JSON',
      min_score: 'Float',
      search_type: 'String',
      rescore: 'JSON',
      docvalue_fields: '[String]',
      stored_fields: '[String]'
    }
  }));
}

function prepareBodyInResolve(body, fieldMap) {
  /* eslint-disable no-param-reassign */
  if (body.query) {
    body.query = (0, _Query.prepareQueryInResolve)(body.query, fieldMap);
  }

  if (body.aggs) {
    body.aggs = (0, _Aggs.prepareAggsInResolve)(body.aggs, fieldMap);
  }

  return body;
}