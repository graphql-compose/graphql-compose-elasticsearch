"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFunctionScoreITC = getFunctionScoreITC;
exports.prepareFunctionScoreInResolve = prepareFunctionScoreInResolve;

var _graphqlCompose = require("graphql-compose");

var _Query = require("../Query");

var _utils = require("../../../utils");

function getFunctionScoreITC(opts = {}) {
  const name = (0, _utils.getTypeName)('QueryFunctionScore', opts);
  const description = (0, _utils.desc)(`
    The function_score allows you to modify the score of documents that
    are retrieved by a query. This can be useful if, for example,
    a score function is computationally expensive and it is sufficient
    to compute the score on a filtered set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)
  `);

  const RandomScoreType = _graphqlCompose.InputTypeComposer.create({
    name: (0, _utils.getTypeName)('QueryFunctionScoreRandom', opts),
    fields: {
      seed: 'Float'
    }
  });

  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      query: () => (0, _Query.getQueryITC)(opts),
      boost: 'String',
      boost_mode: {
        type: 'String',
        description: 'Can be: `multiply`, `replace`, `sum`, `avg`, `max`, `min`.'
      },
      random_score: RandomScoreType,
      functions: [_graphqlCompose.InputTypeComposer.create({
        name: (0, _utils.getTypeName)('QueryFunctionScoreFunction', opts),
        fields: {
          filter: () => (0, _Query.getQueryITC)(opts),
          random_score: RandomScoreType,
          weight: 'Float',
          script_score: 'JSON',
          field_value_factor: 'JSON',
          gauss: 'JSON',
          linear: 'JSON',
          exp: 'JSON'
        }
      })],
      max_boost: 'Float',
      score_mode: {
        type: 'String',
        description: 'Can be: `multiply`, `sum`, `avg`, `first`, `max`, `min`.'
      },
      min_score: 'Float'
    }
  }));
}
/* eslint-disable no-param-reassign, camelcase */


function prepareFunctionScoreInResolve(function_score, fieldMap) {
  if (function_score.query) {
    function_score.query = (0, _Query.prepareQueryInResolve)(function_score.query, fieldMap);
  }

  if (Array.isArray(function_score.functions)) {
    function_score.functions = function_score.functions.map(func => {
      if (func.filter) {
        func.filter = (0, _Query.prepareQueryInResolve)(func.filter, fieldMap);
      }

      return func;
    });
  }

  return function_score;
}