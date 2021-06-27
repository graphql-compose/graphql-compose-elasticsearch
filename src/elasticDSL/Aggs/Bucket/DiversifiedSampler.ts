import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';
import { getAllFields } from '../../Commons/FieldNames';

export function getDiversifiedSamplerITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsDiversifiedSampler', opts);
  const description = desc(
    `
    A filtering aggregation used to limit any sub aggregations' processing to
    a sample of the top-scoring documents. Diversity settings are used to
    limit the number of matches that share a common value such as an "author".
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-diversified-sampler-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      shard_size: {
        type: 'String',
        defaultValue: 100,
      },
      field: getAllFields(opts),
      max_docs_per_value: 'Int',
      script: (): InputTypeComposer<TContext> => getCommonsScriptITC(opts),
      execution_hint: 'String',
    },
  }));
}
