import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getReverseNestedITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('AggsReverseNested', opts);
  const description = desc(
    `
    A special single bucket aggregation that enables aggregating on parent docs
    from nested documents.
    The \`reverse_nested\` aggregation must be defined inside a \`nested\` aggregation.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-reverse-nested-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      path: 'String',
    },
  }));
}
