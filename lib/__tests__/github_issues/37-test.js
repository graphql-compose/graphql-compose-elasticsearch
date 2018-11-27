"use strict";

var _elasticsearch = _interopRequireDefault(require("elasticsearch"));

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql");

var _ = require("../..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const ELASTICSEARCH_HOST = '';
const ELASTICSEARCH_API_VERSION = '5.2';
const mapping = {
  properties: {
    id: {
      type: 'keyword'
    },
    title: {
      type: 'text'
    },
    tags: {
      type: 'text'
    }
  }
};
const elasticClient = new _elasticsearch.default.Client({
  host: ELASTICSEARCH_HOST,
  apiVersion: ELASTICSEARCH_API_VERSION,
  log: 'info' // FOR DETAILED DEBUG USE - 'trace'

});
const elasticIndex = 'github37';
const elasticType = 'activities';
const ActivitiesEsTC = (0, _.composeWithElastic)({
  graphqlTypeName: 'SearchActivities',
  elasticMapping: mapping,
  pluralFields: ['tags'],
  elasticIndex,
  elasticType,
  elasticClient
});
beforeAll(
/*#__PURE__*/
_asyncToGenerator(function* () {
  const indexExists = yield elasticClient.indices.exists({
    index: elasticIndex
  });

  if (indexExists) {
    yield elasticClient.indices.delete({
      index: elasticIndex
    });
  } // create demo record directly in elastic


  yield elasticClient.create({
    index: elasticIndex,
    type: elasticType,
    id: '333',
    body: {
      title: 'Test 1',
      tags: ['y', 'z']
    }
  });
}));
describe('github issue #37 - Mutations via updateById overwrite arrays instead of appending to them', () => {
  it('create custom resolver',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    expect(ActivitiesEsTC).toBeInstanceOf(_graphqlCompose.TypeComposer);
    ActivitiesEsTC.addResolver({
      name: 'addTag',
      kind: 'mutation',
      type: 'JSON',
      args: {
        id: 'String!',
        tag: 'String!'
      },
      resolve: ({
        args
      }) => {
        return elasticClient.update({
          index: elasticIndex,
          type: elasticType,
          id: args.id,
          body: {
            script: {
              inline: 'ctx._source.tags.add(params.tag)',
              params: {
                tag: args.tag
              }
            }
          }
        });
      }
    }); // create simple Schema for EE test

    _graphqlCompose.schemaComposer.Query.addFields({
      noop: 'String'
    }); // by spec query MUST be always present


    _graphqlCompose.schemaComposer.Mutation.addFields({
      activitiesAddTag: ActivitiesEsTC.getResolver('addTag')
    });

    const schema = _graphqlCompose.schemaComposer.buildSchema(); // update record via graphql


    const graphqlResponse = yield (0, _graphql.graphql)({
      schema,
      source: `
        mutation {
          activitiesAddTag(id: "333", tag: "x")
        }
      `
    }); // check graphql response

    expect(graphqlResponse).toEqual({
      data: {
        activitiesAddTag: {
          _id: '333',
          _index: 'github37',
          _shards: {
            failed: 0,
            successful: 1,
            total: 2
          },
          _type: 'activities',
          _version: 2,
          result: 'updated'
        }
      }
    }); // check demo record directly in elastic

    const elasticData = yield elasticClient.get({
      index: elasticIndex,
      type: elasticType,
      id: '333',
      _source: true
    });
    expect(elasticData).toEqual({
      _id: '333',
      _index: 'github37',
      _source: {
        tags: ['y', 'z', 'x'],
        title: 'Test 1'
      },
      _type: 'activities',
      _version: 2,
      found: true
    });
  }));
});