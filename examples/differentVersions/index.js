import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import elasticsearch from 'elasticsearch';
import ElasticApiParser from '../../src/ElasticApiParser'; // or import { ElasticApiParser } from 'graphql-compose-elasticsearch';

const expressPort = process.env.port || process.env.PORT || 9201;

const generatedSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      // see node_modules/elasticsearch/src/lib/apis/ for available versions

      elastic50: {
        description: 'Elastic v5.0',
        type: new GraphQLObjectType({
          name: 'Elastic50',
          fields: new ElasticApiParser({ version: '5_0', prefix: 'Elastic50' }).run(),
        }),
        args: {
          host: {
            type: GraphQLString,
            defaultValue: 'http://user:pass@localhost:9200',
          },
        },
        resolve: (src, args, context) => {
          context.elasticClient = new elasticsearch.Client({ // eslint-disable-line no-param-reassign
            host: args.host,
            apiVersion: '5.0',
            log: 'trace',
          });
          return {};
        },
      },

      elastic24: {
        description: 'Elastic v2.4',
        type: new GraphQLObjectType({
          name: 'Elastic24',
          fields: new ElasticApiParser({ version: '2_4', prefix: 'Elastic24' }).run(),
        }),
        args: {
          host: {
            type: GraphQLString,
            defaultValue: 'http://user:pass@localhost:9200',
          },
        },
        resolve: (src, args, context) => {
          context.elasticClient = new elasticsearch.Client({ // eslint-disable-line no-param-reassign
            host: args.host,
            apiVersion: '2.4',
          });
          return {};
        },
      },

      elastic17: {
        description: 'Elastic v1.7',
        type: new GraphQLObjectType({
          name: 'Elastic17',
          fields: new ElasticApiParser({ version: '5_0', prefix: 'Elastic17' }).run(),
        }),
        args: {
          host: {
            type: GraphQLString,
            defaultValue: 'http://user:pass@localhost:9200',
          },
        },
        resolve: (src, args, context) => {
          context.elasticClient = new elasticsearch.Client({ // eslint-disable-line no-param-reassign
            host: args.host,
            apiVersion: '1.7',
          });
          return {};
        },
      },
    },
  }),
});

const server = express();
server.use('/', graphqlHTTP({
  schema: generatedSchema,
  graphiql: true,
  context: {
    // elasticClient: new elasticsearch.Client({
    //   host: 'http://localhost:9200',
    //   apiVersion: '5.0',
    //   log: 'trace',
    // }),
  },
}));

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
