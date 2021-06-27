import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC, prepareQueryInResolve } from '../Query';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getFunctionScoreITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('QueryFunctionScore', opts);
  const description = desc(
    `
    The function_score allows you to modify the score of documents that
    are retrieved by a query. This can be useful if, for example,
    a score function is computationally expensive and it is sufficient
    to compute the score on a filtered set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)
  `
  );

  const RandomScoreType = opts.schemaComposer.createInputTC({
    name: getTypeName('QueryFunctionScoreRandom', opts),
    fields: {
      seed: 'Float',
    },
  });

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      query: (): InputTypeComposer<TContext> => getQueryITC(opts),
      boost: 'String',
      boost_mode: {
        type: 'String',
        description: 'Can be: `multiply`, `replace`, `sum`, `avg`, `max`, `min`.',
      },
      random_score: RandomScoreType,
      functions: [
        opts.schemaComposer.createInputTC({
          name: getTypeName('QueryFunctionScoreFunction', opts),
          fields: {
            filter: (): InputTypeComposer<TContext> => getQueryITC(opts),
            random_score: RandomScoreType,
            weight: 'Float',
            script_score: 'JSON',
            field_value_factor: 'JSON',
            gauss: 'JSON',
            linear: 'JSON',
            exp: 'JSON',
          },
        }),
      ],
      max_boost: 'Float',
      score_mode: {
        type: 'String',
        description: 'Can be: `multiply`, `sum`, `avg`, `first`, `max`, `min`.',
      },
      min_score: 'Float',
    },
  }));
}

/* eslint-disable no-param-reassign, camelcase */
export function prepareFunctionScoreInResolve(
  function_score: any,
  fieldMap: any
): { [argName: string]: any } {
  if (function_score.query) {
    function_score.query = prepareQueryInResolve(function_score.query, fieldMap);
  }

  if (Array.isArray(function_score.functions)) {
    function_score.functions = function_score.functions.map((func: any) => {
      if (func.filter) {
        func.filter = prepareQueryInResolve(func.filter, fieldMap);
      }
      return func;
    });
  }

  return function_score;
}
