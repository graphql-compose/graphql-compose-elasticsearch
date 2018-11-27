/* @flow */

import { InputTypeComposer, type ComposeInputFieldConfigAsObject } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../../utils';
import { getAllAsFieldConfigMap } from '../../Commons/FieldNames';

export function getTermsITC(opts: mixed = {}): InputTypeComposer | ComposeInputFieldConfigAsObject {
  const name = getTypeName('QueryTerms', opts);
  const description = desc(
    `
    Filters documents that have fields that match any of
    the provided terms (not analyzed). { fieldName: [values] }
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html)
  `
  );

  const fields = getAllAsFieldConfigMap(opts, '[JSON]');

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
