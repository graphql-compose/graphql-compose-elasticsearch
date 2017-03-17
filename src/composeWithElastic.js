import { TypeComposer, InputTypeComposer } from 'graphql-compose';
import {
  convertToSourceTC,
  inputPropertiesToGraphQLTypes,
} from './mappingConverter';
import type { ElasticMappingT } from './mappingConverter';

export type composeWithElasticOptsT = {
  typeName: string,
  pluralFields?: string[],
};

export function composeWithElastic(
  mapping: ElasticMappingT,
  opts: composeWithElasticOptsT = {}
): TypeComposer {
  if (!opts) {
    throw new Error('Opts is required argument for composeWithElastic()');
  }

  if (typeof opts.typeName !== 'string' || !opts.typeName) {
    throw new Error(
      'Opts.typeName is required option for TypeName in composeWithElastic()'
    );
  }

  if (opts.pluralFields && !Array.isArray(opts.pluralFields)) {
    throw new Error(
      'Opts.pluralFields should be an Array of strings with field names ' +
        'which are plural (you may use dot notation for nested fields).'
    );
  }

  const tc = convertToSourceTC(mapping, opts.typeName, opts);

  const propsMap = inputPropertiesToGraphQLTypes(mapping);

  return tc;
}
