/* @flow */

import {
  InputTypeComposer,
  type ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../../utils';
import { getAllAsFieldConfigMap } from '../../Commons/FieldNames';

export function getTermsITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
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
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields,
    }));
  }

  return {
    type: 'JSON',
    description,
  };
}
