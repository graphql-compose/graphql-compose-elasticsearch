/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getCommonsScriptITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('CommonsScript', opts);
  const description = desc(
    `
    The scripting module enables you to use scripts to evaluate custom expressions.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting.html)
  `
  );

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        lang: 'String!',
        inline: 'String!',
        params: 'JSON',
        file: 'String',
      },
    })
  );
}
