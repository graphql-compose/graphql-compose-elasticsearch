import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphql } from 'graphql-compose';
import { elasticApiFieldConfig } from '../../src'; // from 'graphql-compose-elasticsearch';

const { GraphQLSchema, GraphQLObjectType } = graphql;

const expressPort = process.env.port || process.env.PORT || 9201;

const generatedSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      elastic56: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '5.6',
        // log: 'trace',
      }),

      elastic68: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '6.8',
        // log: 'trace',
      }),

      elastic77: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '7.7',
        // log: 'trace',
      }),
    },
  }),
});

const server = express();
server.use(
  '/',
  graphqlHTTP({
    schema: generatedSchema,
    graphiql: true,
  })
);

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});
