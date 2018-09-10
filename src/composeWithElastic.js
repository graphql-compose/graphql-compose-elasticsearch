/* @flow */

import { TypeComposer } from 'graphql-compose';
import { convertToSourceTC, inputPropertiesToGraphQLTypes } from './mappingConverter';
import createSearchResolver from './resolvers/search';
import createSearchConnectionResolver from './resolvers/searchConnection';
import createSearchPaginationResolver from './resolvers/searchPagination';
import createFindByIdResolver from './resolvers/findById';
import createUpdateByIdResolver from './resolvers/updateById';

import type { ElasticMappingT } from './mappingConverter';

export type composeWithElasticOptsT = {
  graphqlTypeName: string,
  elasticIndex: string,
  elasticType: string,
  elasticMapping: ElasticMappingT,
  elasticClient: Object,
  pluralFields?: string[],
  prefix?: ?string,
  postfix?: ?string,
};

export function composeWithElastic(opts: composeWithElasticOptsT): TypeComposer {
  if (!opts) {
    throw new Error('Opts is required argument for composeWithElastic()');
  }

  if (!opts.elasticMapping || !opts.elasticMapping.properties) {
    throw new Error(
      'You provide incorrect elasticMapping property. It should be an object `{ properties: {} }`'
    );
  }

  if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
    throw new Error(
      'Third arg for Resolver search() should contain `elasticIndex` string property from your Elastic server.'
    );
  }

  if (!opts.elasticType || typeof opts.elasticType !== 'string') {
    throw new Error(
      'Third arg for Resolver search() should contain `elasticType` string property from your Elastic server.'
    );
  }

  if (typeof opts.graphqlTypeName !== 'string' || !opts.graphqlTypeName) {
    throw new Error(
      'Opts.graphqlTypeName is required property for generated GraphQL Type name in composeWithElastic()'
    );
  }

  if (!opts.prefix) {
    opts.prefix = opts.graphqlTypeName; // eslint-disable-line
  }

  if (opts.pluralFields && !Array.isArray(opts.pluralFields)) {
    throw new Error(
      'Opts.pluralFields should be an Array of strings with field names ' +
        'which are plural (you may use dot notation for nested fields).'
    );
  }

  const fieldMap = inputPropertiesToGraphQLTypes(opts.elasticMapping);
  const sourceTC = convertToSourceTC(opts.elasticMapping, opts.graphqlTypeName, opts);

  const searchR = createSearchResolver(fieldMap, sourceTC, opts);
  const searchConnectionR = createSearchConnectionResolver(searchR, opts);
  const searchPaginationR = createSearchPaginationResolver(searchR, opts);
  const findByIdR = createFindByIdResolver(fieldMap, sourceTC, opts);
  const updateByIdR = createUpdateByIdResolver(fieldMap, sourceTC, opts);

  sourceTC.addResolver(searchR);
  sourceTC.addResolver(searchConnectionR);
  sourceTC.addResolver(searchPaginationR);
  sourceTC.addResolver(findByIdR);
  sourceTC.addResolver(updateByIdR);

  return sourceTC;
}
