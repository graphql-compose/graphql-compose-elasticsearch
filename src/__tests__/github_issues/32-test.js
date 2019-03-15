/* @flow */

import elasticsearch from 'elasticsearch';
import { TypeComposer, Resolver } from 'graphql-compose';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { composeWithElastic } from '../..';

const ELASTICSEARCH_HOST = '';
const ELASTICSEARCH_API_VERSION = '6.0';
const mapping = {
  properties: {
    id: {
      type: 'keyword',
    },
    title: {
      type: 'text',
    },
    description: {
      type: 'text',
    },
  },
};

const ActivitiesEsTC = composeWithElastic({
  graphqlTypeName: 'SearchActivities',
  elasticIndex: 'myindex',
  elasticType: 'activities',
  elasticMapping: mapping,
  elasticClient: new elasticsearch.Client({
    host: ELASTICSEARCH_HOST,
    apiVersion: ELASTICSEARCH_API_VERSION,
    log: 'info',
  }),
});

describe('github issue #32 - hits returns me the found id, score, type...', () => {
  it('test `search` resolver', () => {
    expect(ActivitiesEsTC).toBeInstanceOf(TypeComposer);

    const resolver = ActivitiesEsTC.getResolver('search');
    expect(resolver).toBeInstanceOf(Resolver);

    const OutputType: any = resolver.getType();
    const OutputTC = TypeComposer.create(OutputType);
    expect(OutputTC.getFieldNames()).toEqual([
      'hits',
      'count',
      'aggregations',
      'max_score',
      'took',
      'timed_out',
      '_shards',
    ]);

    const HitsTC = OutputTC.getFieldTC('hits');
    expect(HitsTC).toBeInstanceOf(TypeComposer);
    expect(HitsTC.getFieldNames()).toEqual([
      '_index',
      '_type',
      '_id',
      '_score',
      '_source',
      '_shard',
      '_node',
      '_explanation',
      '_version',
      'highlight',
      'sort',
      'fields',
    ]);

    const SourceTC = HitsTC.getFieldTC('_source');
    expect(SourceTC.getTypeName()).toBe('SearchActivitiesSearchActivities');
    expect(SourceTC).toBeInstanceOf(TypeComposer);
    expect(SourceTC.getFieldNames()).toEqual(['id', 'title', 'description']);
  });

  it('test schema', () => {
    const schema: any = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          searchActivities: ActivitiesEsTC.getResolver('search').getFieldConfig(),
        },
      }),
    });

    const fc: any = schema._queryType.getFields().searchActivities;

    const OutputTC = TypeComposer.create(fc.type);
    expect(OutputTC.getFieldNames()).toEqual([
      'hits',
      'count',
      'aggregations',
      'max_score',
      'took',
      'timed_out',
      '_shards',
    ]);

    const HitsTC = OutputTC.getFieldTC('hits');
    expect(HitsTC).toBeInstanceOf(TypeComposer);
    expect(HitsTC.getFieldNames()).toEqual([
      '_index',
      '_type',
      '_id',
      '_score',
      '_source',
      '_shard',
      '_node',
      '_explanation',
      '_version',
      'highlight',
      'sort',
      'fields',
    ]);

    const SourceTC = HitsTC.getFieldTC('_source');
    expect(SourceTC.getTypeName()).toBe('SearchActivitiesSearchActivities');
    expect(SourceTC).toBeInstanceOf(TypeComposer);
    expect(SourceTC.getFieldNames()).toEqual(['id', 'title', 'description']);
  });
});
