/* @flow */

import elasticsearch from 'elasticsearch';
import { graphql } from 'graphql-compose';
import { composeWithElastic, elasticApiFieldConfig } from '../../src'; // from 'graphql-compose-elasticsearch';

const { GraphQLSchema, GraphQLObjectType } = graphql;

// Mapping obtained from ElasticSearch server
// If you have existed index in ES you may load mapping via
//   GET http://user:pass@localhost:9200/demo_user/_mapping
//   and then get subtree of returned document which contains
//   properties definitions (which looks like following data):
const demoUserMapping = {
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
};

const UserEsTC = composeWithElastic({
  graphqlTypeName: 'UserES',
  elasticIndex: 'demo_user',
  elasticType: 'demo_user',
  elasticMapping: demoUserMapping,
  elasticClient: new elasticsearch.Client({
    host: 'http://localhost:9200',
    apiVersion: '5.0',
    log: 'trace',
  }),
  // elastic mapping does not contain information about is fields are arrays or not
  // so provide this information explicitly for obtaining correct types in GraphQL
  pluralFields: ['skills', 'languages'],
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: UserEsTC.getResolver('search').getFieldConfig(),
      userConnection: UserEsTC.getResolver('searchConnection').getFieldConfig(),
      elastic50: elasticApiFieldConfig({
        host: 'http://user:pass@localhost:9200',
        apiVersion: '5.0',
        log: 'trace',
      }),
    },
  }),
});

export default schema;
