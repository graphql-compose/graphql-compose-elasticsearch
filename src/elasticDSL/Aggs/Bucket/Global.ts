import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';

export function getGlobalITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsGlobal', opts);
  const description = desc(
    `
    Defines a single bucket of all the documents within the search execution
    context. This context is defined by the indices and the document types
    you’re searching on, but is not influenced by the search query itself.
    Should have empty body, without fields, eg. \`global: {}\`
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-global-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      _without_fields_: 'JSON',
    },
  }));
}
