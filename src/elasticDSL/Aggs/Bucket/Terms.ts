import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';
import { getTermFields } from '../../Commons/FieldNames';

export function getTermsITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsTerms', opts);
  const description = desc(
    `
    A multi-bucket value source based aggregation where buckets
    are dynamically built - one per unique value.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: (): any => getTermFields(opts),
      size: {
        type: 'Int',
        defaultValue: 10,
      },
      shard_size: 'Int',
      order: 'JSON',
      include: 'JSON',
      exclude: 'JSON',
      script: (): InputTypeComposer<TContext> => getCommonsScriptITC(opts),
      execution_hint: 'String',
      missing: 'JSON',
    },
  }));
}
