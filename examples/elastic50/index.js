/* @flow */
/* eslint-disable no-console */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphql } from 'graphql-compose';
import elasticsearch from 'elasticsearch';
import { composeWithElastic, elasticApiFieldConfig } from '../../src'; // from 'graphql-compose-elasticsearch';

const { GraphQLSchema, GraphQLObjectType } = graphql;

const expressPort = process.env.port || process.env.PORT || 9201;

// mapping obtained from ElasticSearch server
// GET http://user:pass@localhost:9200/user/_mapping
const indexMapping = {
  user: {
    mappings: {
      user: {
        properties: {
          name: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
              },
            },
          },
          gender: {
            type: 'text',
          },
          birthday: {
            type: 'date',
          },
          position: {
            type: 'text',
          },
          relocation: {
            type: 'boolean',
          },
          salary: {
            properties: {
              currency: {
                type: 'text',
              },
              total: {
                type: 'double',
              },
            },
          },
          skills: {
            type: 'text',
          },
          languages: {
            type: 'keyword',
          },
          location: {
            properties: {
              name: {
                type: 'text',
              },
              point: {
                type: 'geo_point',
              },
            },
          },
          experience: {
            properties: {
              company: {
                type: 'text',
              },
              description: {
                type: 'text',
              },
              end: {
                type: 'date',
              },
              position: {
                type: 'text',
              },
              start: {
                type: 'date',
              },
              tillNow: {
                type: 'boolean',
              },
            },
          },
          createdAt: {
            type: 'date',
          },
        },
      },
    },
  },
};

const UserEsTC = composeWithElastic({
  graphqlTypeName: 'UserES',
  elasticIndex: 'cv',
  elasticType: 'cv',
  elasticMapping: indexMapping.user.mappings.user,
  elasticClient: new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '5.0',
    log: 'trace',
  }),
  // elastic mapping does not contain information about is fields are arrays or not
  // so provide this information explicitly for obtaining correct types in GraphQL
  pluralFields: ['skills', 'languages'],
});

const generatedSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: UserEsTC.get('$search').getFieldConfig(),
      userConnection: UserEsTC.get('$searchConnection').getFieldConfig(),
      elastic50: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '5.0',
        log: 'trace',
      }),
    },
  }),
});

const server = express();
server.use(
  '/',
  graphqlHTTP({
    schema: (generatedSchema: any),
    graphiql: true,
    formatError: error => ({
      message: error.message,
      stack: error.stack.split('\n'),
    }),
  })
);

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
