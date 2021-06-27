import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../utils';
import { getAggRulesITC } from './AggRules';

export function getAggBlockITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggBlock', opts);
  const description = desc(
    `
    The aggregations framework helps provide aggregated data based on
    a search query. It is based on simple building blocks called aggregations,
    that can be composed in order to build complex summaries of the data.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      key: {
        type: 'String',
        description: 'FieldName in response for aggregation result',
      },
      value: {
        type: () => getAggRulesITC(opts),
        description: 'Aggregation rules',
      },
    },
  }));
}
