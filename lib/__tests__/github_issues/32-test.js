"use strict";

var _elasticsearch = _interopRequireDefault(require("elasticsearch"));

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql");

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ELASTICSEARCH_HOST = '';
const ELASTICSEARCH_API_VERSION = '5.0';
const mapping = {
  properties: {
    id: {
      type: 'keyword'
    },
    title: {
      type: 'text'
    },
    description: {
      type: 'text'
    }
  }
};
const ActivitiesEsTC = (0, _.composeWithElastic)({
  graphqlTypeName: 'SearchActivities',
  elasticIndex: 'myindex',
  elasticType: 'activities',
  elasticMapping: mapping,
  elasticClient: new _elasticsearch.default.Client({
    host: ELASTICSEARCH_HOST,
    apiVersion: ELASTICSEARCH_API_VERSION,
    log: 'info'
  })
});
describe('github issue #32 - hits returns me the found id, score, type...', () => {
  it('test `search` resolver', () => {
    expect(ActivitiesEsTC).toBeInstanceOf(_graphqlCompose.TypeComposer);
    const resolver = ActivitiesEsTC.getResolver('search');
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
    const OutputType = resolver.getType();

    const OutputTC = _graphqlCompose.TypeComposer.create(OutputType);

    expect(OutputTC.getFieldNames()).toEqual(['hits', 'count', 'aggregations', 'max_score', 'took', 'timed_out', '_shards']);
    const HitsTC = OutputTC.getFieldTC('hits');
    expect(HitsTC).toBeInstanceOf(_graphqlCompose.TypeComposer);
    expect(HitsTC.getFieldNames()).toEqual(['_index', '_type', '_id', '_score', '_source', '_shard', '_node', '_explanation', '_version', 'highlight', 'sort', 'fields']);
    const SourceTC = HitsTC.getFieldTC('_source');
    expect(SourceTC.getTypeName()).toBe('SearchActivitiesSearchActivities');
    expect(SourceTC).toBeInstanceOf(_graphqlCompose.TypeComposer);
    expect(SourceTC.getFieldNames()).toEqual(['id', 'title', 'description']);
  });
  it('test schema', () => {
    const schema = new _graphql.GraphQLSchema({
      query: new _graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
          searchActivities: ActivitiesEsTC.getResolver('search').getFieldConfig()
        }
      })
    });

    const fc = schema._queryType.getFields().searchActivities;

    const OutputTC = _graphqlCompose.TypeComposer.create(fc.type);

    expect(OutputTC.getFieldNames()).toEqual(['hits', 'count', 'aggregations', 'max_score', 'took', 'timed_out', '_shards']);
    const HitsTC = OutputTC.getFieldTC('hits');
    expect(HitsTC).toBeInstanceOf(_graphqlCompose.TypeComposer);
    expect(HitsTC.getFieldNames()).toEqual(['_index', '_type', '_id', '_score', '_source', '_shard', '_node', '_explanation', '_version', 'highlight', 'sort', 'fields']);
    const SourceTC = HitsTC.getFieldTC('_source');
    expect(SourceTC.getTypeName()).toBe('SearchActivitiesSearchActivities');
    expect(SourceTC).toBeInstanceOf(_graphqlCompose.TypeComposer);
    expect(SourceTC.getFieldNames()).toEqual(['id', 'title', 'description']);
  });
});