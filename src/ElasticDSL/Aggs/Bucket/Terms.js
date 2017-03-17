/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getCommonsScriptITC } from '../../Commons/Script';

export function getTermsITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('AggsTerms', opts);
  const description = desc(
    `
    A multi-bucket value source based aggregation where buckets
    are dynamically built - one per unique value.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        field: 'String',
        size: {
          type: 'Int',
          defaultValue: 10,
        },
        shard_size: 'Int',
        order: 'JSON',
        include: 'JSON',
        exclude: 'JSON',
        script: () => getCommonsScriptITC(opts),
        execution_hint: 'String',
        missing: 'JSON',
      },
    }));
}
