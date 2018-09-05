/* @flow */
/* eslint-disable no-param-reassign */

import { TypeComposer, graphql } from 'graphql-compose';
import type { GraphQLFieldConfig } from 'graphql';
import elasticsearch from 'elasticsearch';
import ElasticApiParser from './ElasticApiParser';

const DEFAULT_ELASTIC_API_VERSION = '_default';
const { GraphQLString } = graphql;

export function elasticApiFieldConfig(esClientOrOpts: Object): GraphQLFieldConfig<any, any> {
  if (!esClientOrOpts || typeof esClientOrOpts !== 'object') {
    throw new Error(
      'You should provide ElasticClient instance or ElasticClientConfig in first argument.'
    );
  }

  if (isElasticClient(esClientOrOpts)) {
    return instanceElasticClient(esClientOrOpts);
  } else {
    return contextElasticClient(esClientOrOpts);
  }
}

function instanceElasticClient(elasticClient: Object): GraphQLFieldConfig<any, any> {
  const apiVersion = elasticClient.transport._config.apiVersion || DEFAULT_ELASTIC_API_VERSION;
  const prefix = `ElasticAPI${apiVersion.replace('.', '')}`;

  const apiParser = new ElasticApiParser({
    elasticClient,
    prefix,
  });

  return {
    description: `Elastic API v${apiVersion}`,
    type: TypeComposer.create({
      name: prefix,
      fields: apiParser.generateFieldMap(),
    }).getType(),
    resolve: () => ({}),
  };
}

function contextElasticClient(elasticConfig: Object): GraphQLFieldConfig<any, any> {
  if (!elasticConfig.apiVersion) {
    elasticConfig.apiVersion = DEFAULT_ELASTIC_API_VERSION;
  }
  const { apiVersion } = elasticConfig;
  const prefix = `ElasticAPI${apiVersion.replace('.', '')}`;

  const apiParser = new ElasticApiParser({
    apiVersion,
    prefix,
  });

  return {
    description: `Elastic API v${apiVersion}`,
    type: TypeComposer.create({
      name: prefix,
      fields: apiParser.generateFieldMap(),
    }).getType(),
    args: {
      host: {
        type: GraphQLString,
        defaultValue: elasticConfig.host || 'http://user:pass@localhost:9200',
      },
    },
    resolve: (src: any, args: Object, context: Object) => {
      if (typeof context === 'object') {
        const opts = args.host
          ? {
              ...elasticConfig,
              host: args.host,
            }
          : elasticConfig;
        context.elasticClient = new elasticsearch.Client(opts);
      }
      return {};
    },
  };
}

function isElasticClient(obj) {
  if (obj instanceof elasticsearch.Client) {
    return true;
  }

  if (obj && obj.transport && obj.transport._config && obj.transport._config.__reused) {
    return true;
  }

  return false;
}
