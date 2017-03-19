/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from "../../../utils";
import { getCommonsScriptITC } from '../../Commons/Script';

export function getScriptITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('QueryScript', opts);
  const description = desc(`
    A query allowing to define scripts as queries. They are typically used in a filter context.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-script-query.html)
  `);

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        script: () => getCommonsScriptITC(opts),
      },
    })
  );
}
