/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getQueryITC } from '../Query';
import { getTypeName, getOrSetType, desc } from "../../../utils";

export function getFunctionScoreITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryFunctionScore', opts);
  const description = desc(`
    The function_score allows you to modify the score of documents that
    are retrieved by a query. This can be useful if, for example,
    a score function is computationally expensive and it is sufficient
    to compute the score on a filtered set of documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)
  `);

  // $FlowFixMe
  const RandomScoreType = InputTypeComposer.create({
    name: getTypeName('QueryFunctionScoreRandom', opts),
    fields: {
      seed: 'Float',
    },
  });

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        query: () => getQueryITC(opts),
        boost: 'String',
        boost_mode: {
          type: 'String',
          description: 'Can be: `multiply`, `replace`, `sum`, `avg`, `max`, `min`.',
        },
        random_score: RandomScoreType,
        // $FlowFixMe
        functions: [InputTypeComposer.create({
          name: getTypeName('QueryFunctionScoreFunction', opts),
          fields: {
            filter: () => getQueryITC(opts),
            random_score: RandomScoreType,
            weight: 'Float',
            script_score: 'JSON',
            field_value_factor: 'JSON',
            gauss: 'JSON',
            linear: 'JSON',
            exp: 'JSON',
          },
        })],
        max_boost: 'Float',
        score_mode: {
          type: 'String',
          description: 'Can be: `multiply`, `sum`, `avg`, `first`, `max`, `min`.',
        },
        min_score: 'Float',
      },
    })
  );
}
