/* @flow */
/* eslint-disable no-console */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

const expressPort = process.env.port || process.env.PORT || 9201;

const server = express();
server.use(
  '/',
  graphqlHTTP({
    schema: (schema: any),
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
