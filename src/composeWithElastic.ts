import {
  ObjectTypeComposer,
  SchemaComposer,
  schemaComposer as globalSchemaComposer,
} from 'graphql-compose';
import { convertToSourceTC, inputPropertiesToGraphQLTypes } from './mappingConverter';
import createSearchResolver from './resolvers/search';
import createSearchConnectionResolver from './resolvers/searchConnection';
import createSearchPaginationResolver from './resolvers/searchPagination';
import createFindByIdResolver from './resolvers/findById';
import createUpdateByIdResolver from './resolvers/updateById';
import { prepareCommonOpts } from './utils';

import type { ElasticMappingT } from './mappingConverter';

export type composeWithElasticOptsT<TContext> = {
  graphqlTypeName: string;
  elasticIndex: string;
  elasticType: string;
  elasticMapping: ElasticMappingT;
  elasticClient: any;
  pluralFields?: string[];
  prefix?: string;
  postfix?: string;
  schemaComposer?: SchemaComposer<TContext>;
};

export function composeWithElastic<TContext>(
  opts: composeWithElasticOptsT<TContext>
): ObjectTypeComposer<any, TContext> {
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

  if (opts.schemaComposer && !(opts.schemaComposer instanceof SchemaComposer)) {
    throw new Error(
      'Opts.schemaComposer should be an SchemaComposer instance from graphql-compose package.'
    );
  }

  const schemaComposer = opts.schemaComposer || globalSchemaComposer;

  const fieldMap = inputPropertiesToGraphQLTypes(opts.elasticMapping);
  const sourceTC = convertToSourceTC(
    schemaComposer,
    opts.elasticMapping,
    opts.graphqlTypeName,
    opts
  );
  const commonOpts = prepareCommonOpts(schemaComposer, {
    ...opts,
    prefix: opts.prefix || 'Es',
    fieldMap,
    sourceTC,
    schemaComposer,
  });

  const searchR = createSearchResolver(commonOpts);
  const searchConnectionR = createSearchConnectionResolver(commonOpts, searchR);
  const searchPaginationR = createSearchPaginationResolver(commonOpts, searchR);
  const findByIdR = createFindByIdResolver(commonOpts);
  const updateByIdR = createUpdateByIdResolver(commonOpts);

  sourceTC.addResolver(searchR);
  sourceTC.addResolver(searchConnectionR);
  sourceTC.addResolver(searchPaginationR);
  sourceTC.addResolver(findByIdR);
  sourceTC.addResolver(updateByIdR);

  return sourceTC;
}
