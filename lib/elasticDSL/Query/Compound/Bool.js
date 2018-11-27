"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBoolITC = getBoolITC;
exports.prepareBoolInResolve = prepareBoolInResolve;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getBoolITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryBool', opts);
  const description = (0, _utils.desc)(`
    A query that matches documents matching boolean combinations
    of other queries. The bool query maps to Lucene BooleanQuery.
    It is built using one or more boolean clauses, each clause
    with a typed occurrence.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      must: {
        type: () => [(0, _Query.getQueryITC)(opts)],
        description: (0, _utils.desc)(`
            The clause (query) must appear in matching documents
            and will contribute to the score.
          `)
      },
      filter: {
        type: () => [(0, _Query.getQueryITC)(opts)],
        description: (0, _utils.desc)(`
            The clause (query) must appear in matching documents.
            However unlike must the score of the query will be ignored.
            Filter clauses are executed in filter context, meaning
            that scoring is ignored and clauses are considered for caching.
          `)
      },
      should: {
        type: () => [(0, _Query.getQueryITC)(opts)],
        description: (0, _utils.desc)(`
            The clause (query) should appear in the matching document.
            In a boolean query with no must or filter clauses,
            one or more should clauses must match a document.
            The minimum number of should clauses to match can be set
            using the minimum_should_match parameter.
          `)
      },
      minimum_should_match: {
        type: 'String',
        description: (0, _utils.desc)(`
            The minimum number of should clauses to match.
          `)
      },
      must_not: {
        type: () => [(0, _Query.getQueryITC)(opts)],
        description: (0, _utils.desc)(`
            The clause (query) must not appear in the matching documents.
            Clauses are executed in filter context meaning that scoring
            is ignored and clauses are considered for caching.
            Because scoring is ignored, a score of 0 for all documents
            is returned.
          `)
      },
      boost: 'Float'
    }
  }));
}

function prepareQueryMayBeArray(vals, fieldMap) {
  if (Array.isArray(vals)) {
    return vals.map(val => (0, _Query.prepareQueryInResolve)(val, fieldMap));
  }

  return (0, _Query.prepareQueryInResolve)(vals, fieldMap);
}

function prepareBoolInResolve(bool, fieldMap) {
  /* eslint-disable no-param-reassign */
  if (bool.must) {
    bool.must = prepareQueryMayBeArray(bool.must, fieldMap);
  }

  if (bool.filter) {
    bool.filter = prepareQueryMayBeArray(bool.filter, fieldMap);
  }

  if (bool.should) {
    bool.should = prepareQueryMayBeArray(bool.should, fieldMap);
  }

  if (bool.must_not) {
    bool.must_not = prepareQueryMayBeArray(bool.must_not, fieldMap);
  }

  return bool;
}