import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { elasticApiFieldConfig } from '../../src'; // from 'graphql-compose-elasticsearch';

const expressPort = process.env.port || process.env.PORT || 9201;

const generatedSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      elastic50: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '5.0',
        // log: 'trace',
      }),

      elastic24: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '2.4',
        // log: 'trace',
      }),

      elastic17: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '1.7',
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
