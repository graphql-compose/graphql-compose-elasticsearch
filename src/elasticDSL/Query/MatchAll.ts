import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../utils';

export function getMatchAllITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('QueryMatchAll', opts);
  const description = desc(
    `
    The most simple query, which matches all documents,
    giving them all a _score of 1.0.
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      boost: {
        type: 'Float',
      },
    },
  }));
}
