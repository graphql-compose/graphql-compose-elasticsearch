/* @flow */
/* eslint-disable no-console */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import elasticsearch from 'elasticsearch';
import ElasticApiParser from '../../src/ElasticApiParser'; // or import { ElasticApiParser } from 'graphql-compose-elasticsearch';
import createSearchResolver from '../../src/resolvers/search';
import fieldMap from '../../src/__mocks__/cvMapping';
import {
  inputPropertiesToGraphQLTypes,
  convertToSourceTC,
} from '../../src/mappingConverter';

const expressPort = process.env.port || process.env.PORT || 9201;

const generatedSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // $FlowFixMe
      cv: createSearchResolver(
        inputPropertiesToGraphQLTypes(fieldMap),
        convertToSourceTC(fieldMap, 'Cv', { prefix: '' }),
        new elasticsearch.Client({
          host: 'http://localhost:9200',
          apiVersion: '5.0',
          log: 'trace',
        }),
        {
          prefix: 'Cv',
        }
      ).getFieldConfig(),
      // see node_modules/elasticsearch/src/lib/apis/ for available versions
      elastic50: {
        description: 'Elastic v5.0',
        type: new GraphQLObjectType({
          name: 'Elastic50',
          // $FlowFixMe
          fields: new ElasticApiParser({
            version: '5_0',
            prefix: 'Elastic50',
          }).generateFieldMap(),
        }),
        args: {
          host: {
            type: GraphQLString,
            defaultValue: 'http://user:pass@localhost:9200',
          },
        },
        resolve: (src, args, context) => {
          if (typeof context === 'object') {
            // eslint-disable-next-line no-param-reassign
            context.elasticClient = new elasticsearch.Client({
              host: args.host,
              apiVersion: '5.0',
              log: 'trace',
            });
          }
          return {};
        },
      },
    },
  }),
});

const server = express();
server.use(
  '/',
  graphqlHTTP({
    schema: generatedSchema,
    graphiql: true,
    context: {
      // elasticClient: new elasticsearch.Client({
      //   host: 'http://localhost:9200',
      //   apiVersion: '5.0',
      //   log: 'trace',
      // }),
    },
  })
);

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
