import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';
import { getNumericFields } from '../../Commons/FieldNames';

export function getHistogramITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsHistogram', opts);
  const description = desc(
    `
    A multi-bucket values source based aggregation that can be applied on
    numeric values extracted from the documents. It dynamically builds fixed
    size (a.k.a. interval) buckets over the values.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-histogram-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getNumericFields(opts),
      interval: 'Float',
      missing: 'Float',
      min_doc_count: 'Int',
      extended_bounds: `input ${getTypeName('AggsHistogramBounds', opts)} {
          min: Float
          max: Float
        }`,
      order: 'JSON',
      offset: 'Int',
      keyed: 'Boolean',
    },
  }));
}
