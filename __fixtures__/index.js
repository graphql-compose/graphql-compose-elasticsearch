// @flow

import express from 'express';
import graphqlHttp from 'express-graphql';
import { GQC } from 'graphql-compose';

import { GovStatBinEsTC } from './schemaElastic/GovStatBin';

GQC.rootQuery().addFields({
  userById: GovStatBinEsTC.getResolver('findById'),
  userSearch: GovStatBinEsTC.getResolver('search'),
});
const schema = GQC.buildSchema();

const app = express();

app.use(
  '/',
  graphqlHttp(() => {
    return {
      schema,
      graphiql: true,
    };
  })
);

app.listen(8090, console.log(`App works on 8090...`));
