/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../utils';

export function getCommonsScriptITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('CommonsScript', opts);
  const description = desc(
    `
    The scripting module enables you to use scripts to evaluate custom expressions.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      lang: 'String!',
      inline: 'String!',
      params: 'JSON',
      file: 'String',
    },
  }));
}
