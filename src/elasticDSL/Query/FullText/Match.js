/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAnalyzedAsFieldConfigMap } from '../../Commons/FieldNames';

export function getMatchITC(opts: mixed = {}): InputTypeComposer | ComposeInputFieldConfigAsObject {
  const name = getTypeName('QueryMatch', opts);
  const description = desc(
    `
    Match Query accept text/numerics/dates, analyzes them, and constructs a query.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)
  `
  );

  const subName = getTypeName('QueryMatchSettings', opts);
  const fields = getAnalyzedAsFieldConfigMap(
    opts,
    getOrSetType(subName, () =>
      InputTypeComposer.create({
        name: subName,
        fields: {
          query: 'String',
          operator: 'String',
          zero_terms_query: 'String',
          cutoff_frequency: 'Float',
          boost: 'Float',
        },
      })
    )
  );

  if (typeof fields === 'object') {
    return getOrSetType(name, () =>
      InputTypeComposer.create({
        name,
        description,
        fields,
      })
    );
  }

  return {
    type: 'JSON',
    description,
  };
}
