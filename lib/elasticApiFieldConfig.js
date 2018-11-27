"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elasticApiFieldConfig = elasticApiFieldConfig;

var _graphqlCompose = require("graphql-compose");

var _elasticsearch = _interopRequireDefault(require("elasticsearch"));

var _ElasticApiParser = _interopRequireDefault(require("./ElasticApiParser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_ELASTIC_API_VERSION = '_default';
const GraphQLString = _graphqlCompose.graphql.GraphQLString;

function elasticApiFieldConfig(esClientOrOpts) {
  if (!esClientOrOpts || typeof esClientOrOpts !== 'object') {
    throw new Error('You should provide ElasticClient instance or ElasticClientConfig in first argument.');
  }

  if (isElasticClient(esClientOrOpts)) {
    return instanceElasticClient(esClientOrOpts);
  } else {
    return contextElasticClient(esClientOrOpts);
  }
}

function instanceElasticClient(elasticClient) {
  const apiVersion = elasticClient.transport._config.apiVersion || DEFAULT_ELASTIC_API_VERSION;
  const prefix = `ElasticAPI${apiVersion.replace('.', '')}`;
  const apiParser = new _ElasticApiParser.default({
    elasticClient,
    prefix
  });
  return {
    description: `Elastic API v${apiVersion}`,
    type: _graphqlCompose.TypeComposer.create({
      name: prefix,
      fields: apiParser.generateFieldMap()
    }).getType(),
    resolve: () => ({})
  };
}

function contextElasticClient(elasticConfig) {
  if (!elasticConfig.apiVersion) {
    elasticConfig.apiVersion = DEFAULT_ELASTIC_API_VERSION;
  }

  const apiVersion = elasticConfig.apiVersion;
  const prefix = `ElasticAPI${apiVersion.replace('.', '')}`;
  const apiParser = new _ElasticApiParser.default({
    apiVersion,
    prefix
  });
  return {
    description: `Elastic API v${apiVersion}`,
    type: _graphqlCompose.TypeComposer.create({
      name: prefix,
      fields: apiParser.generateFieldMap()
    }).getType(),
    args: {
      host: {
        type: GraphQLString,
        defaultValue: elasticConfig.host || 'http://user:pass@localhost:9200'
      }
    },
    resolve: (src, args, context) => {
      if (typeof context === 'object') {
        const opts = args.host ? _objectSpread({}, elasticConfig, {
          host: args.host
        }) : elasticConfig;
        context.elasticClient = new _elasticsearch.default.Client(opts);
      }

      return {};
    }
  };
}

function isElasticClient(obj) {
  if (obj instanceof _elasticsearch.default.Client) {
    return true;
  }

  if (obj && obj.transport && obj.transport._config && obj.transport._config.__reused) {
    return true;
  }

  return false;
}