/* @flow */
/* eslint-disable no-param-reassign */

import dox from 'dox';
import fs from 'fs';
import path from 'path';
import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLJSON, upperFirst, TypeComposer } from 'graphql-compose';

import type {
  GraphQLArgumentConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldMap,
  GraphQLInputType,
} from 'graphql/type/definition'; // eslint-disable-line

export type ElasticApiVersion =
  | '5_0'
  | '5_x'
  | '2_4'
  | '2_3'
  | '2_2'
  | '2_1'
  | '2_0'
  | '1_7'
  | '1_6'
  | '1_5'
  | '1_4'
  | '1_3'
  | '1_2'
  | '1_1'
  | '1_0'
  | '0_90';

export type ElasticApiParserOptsT = {
  elasticClient?: any, // Elastic client
  version?: ElasticApiVersion,
  prefix?: string,
  elasticApiFilePath?: string,
};

export type ElasticParamConfigT = {
  type: string,
  name?: string,
  options?: mixed,
  default?: mixed,
};

export type ElasticCaSettingsUrlT = {
  fmt: string,
  req: {
    [name: string]: ElasticParamConfigT,
  },
};

export type ElasticCaSettingsT = {
  params: {
    [name: string]: ElasticParamConfigT,
  },
  url?: ElasticCaSettingsUrlT,
  urls?: ElasticCaSettingsUrlT[],
  needBody?: true,
  method?: string,
};

export type ElasticParsedArgsDescriptionsT = {
  [argName: string]: ?string,
};

export type ElasticParsedSourceT = {
  [dottedMethodName: string]: {
    elasticMethod: string | string[],
    description: string,
    argsSettings: ElasticCaSettingsT,
    argsDescriptions: ElasticParsedArgsDescriptionsT,
  },
};

export default class ElasticApiParser {
  cachedEnums: {
    [fieldName: string]: { [valsStringified: string]: GraphQLEnumType },
  };
  version: string;
  prefix: string;
  elasticClient: any;
  parsedSource: ElasticParsedSourceT;

  constructor(opts: ElasticApiParserOptsT = {}) {
    // derived from installed package `elasticsearch`
    // from ../../node_modules/elasticsearch/src/lib/apis/VERSION.js
    this.version = opts.version || '5_0';
    const apiFilePath = path.resolve(
      opts.elasticApiFilePath ||
        `./node_modules/elasticsearch/src/lib/apis/${this.version}.js`
    );
    const source = ElasticApiParser.loadApiFile(apiFilePath);
    this.parsedSource = ElasticApiParser.parseSource(source);

    this.elasticClient = opts.elasticClient;
    this.prefix = opts.prefix || 'Elastic';
    this.cachedEnums = {};
  }

  static loadApiFile(absolutePath: string): string {
    const code = fs.readFileSync(absolutePath, 'utf8');
    return ElasticApiParser.cleanUpSource(code);
  }

  static cleanUpSource(code: string): string {
    // remove invalid markup
    // {<<api-param-type-boolean,`Boolean`>>} converted to {Boolean}
    const codeCleaned = code.replace(/{<<.+`(.*)`.+}/gi, '{$1}');

    return codeCleaned;
  }

  static parseParamsDescription(
    doxItemAST: any
  ): { [fieldName: string]: string } {
    const descriptions = {};
    if (Array.isArray(doxItemAST.tags)) {
      doxItemAST.tags.forEach(tag => {
        if (!tag || tag.type !== 'param') return;
        if (tag.name === 'params') return;

        const name = ElasticApiParser.cleanupParamName(tag.name);
        if (!name) return;

        descriptions[name] = ElasticApiParser.cleanupDescription(
          tag.description
        );
      });
    }
    return descriptions;
  }

  static cleanupDescription(str: ?string): ?string {
    if (typeof str === 'string') {
      if (str.startsWith('- ')) {
        str = str.substr(2);
      }
      str = str.trim();

      return str;
    }
    return undefined;
  }

  static cleanupParamName(str: ?string): ?string {
    if (typeof str === 'string') {
      if (str.startsWith('params.')) {
        str = str.substr(7);
      }
      str = str.trim();

      return str;
    }
    return undefined;
  }

  static codeToSettings(code: string): ?ElasticCaSettingsT {
    // find code in ca({});
    const reg = /ca\((\{(.|\n)+\})\);/g;
    const matches = reg.exec(code);
    if (matches && matches[1]) {
      return eval('(' + matches[1] + ')'); // eslint-disable-line no-eval
    }
    return undefined;
  }

  static getMethodName(str: string): string | string[] {
    const parts = str.split('.');
    if (parts[0] === 'api') {
      parts.shift();
    }
    if (parts.length === 1) {
      return parts[0];
    } else {
      return parts.filter(o => o !== 'prototype');
    }
  }

  static parseSource(source: string): ElasticParsedSourceT {
    const result = {};

    if (!source || typeof source !== 'string') {
      throw Error('Empty source. It should be non-empty string.');
    }

    const doxAST = dox.parseComments(source, { raw: true });
    if (!doxAST || !Array.isArray(doxAST)) {
      throw Error('Incorrect responce from dox.parseComments');
    }

    doxAST.forEach(item => {
      if (!item.ctx || !item.ctx.string) {
        return;
      }

      // method description
      let description;
      if (item.description && item.description.full) {
        description = ElasticApiParser.cleanupDescription(
          item.description.full
        );
      }

      const elasticMethod = ElasticApiParser.getMethodName(item.ctx.string);
      const dottedMethodName = Array.isArray(elasticMethod)
        ? elasticMethod.join('.')
        : elasticMethod;

      result[dottedMethodName] = {
        elasticMethod,
        description,
        argsSettings: ElasticApiParser.codeToSettings(item.code),
        argsDescriptions: ElasticApiParser.parseParamsDescription(item),
      };
    });

    return result;
  }

  generateFieldMap(): GraphQLFieldMap<*, *> {
    const result = {};
    Object.keys(this.parsedSource).forEach(methodName => {
      result[methodName] = this.generateFieldConfig(methodName);
    });
    return this.reassembleNestedFields(result);
  }

  generateFieldConfig(
    methodName: string,
    methodArgs?: { [paramName: string]: mixed }
  ): GraphQLFieldConfig<*, *> {
    if (!methodName) {
      throw new Error(`You should provide Elastic search method.`);
    }

    if (!this.parsedSource[methodName]) {
      throw new Error(`Elastic search method '${methodName}' does not exists.`);
    }

    const {
      description,
      argsSettings,
      argsDescriptions,
      elasticMethod,
    } = this.parsedSource[methodName];

    const argMap = this.settingsToArgMap(argsSettings, argsDescriptions);

    return {
      type: GraphQLJSON,
      description,
      args: argMap,
      resolve: (src, args, context) => {
        const client = (context && context.elasticClient) || this.elasticClient;

        if (!client) {
          throw new Error(
            'You should provide `elasticClient` when created types via ' +
              '`opts.elasticClient` or in runtime via GraphQL context'
          );
        }

        if (Array.isArray(elasticMethod)) {
          return client[elasticMethod[0]][elasticMethod[1]]({
            ...methodArgs,
            ...args,
          });
        }

        return client[elasticMethod]({ ...methodArgs, ...args });
      },
    };
  }

  paramToGraphQLArgConfig(
    paramCfg: ElasticParamConfigT,
    fieldName: string,
    description?: ?string
  ): GraphQLArgumentConfig {
    const result: GraphQLArgumentConfig = {
      type: this.paramTypeToGraphQL(paramCfg, fieldName),
    };
    if (paramCfg.default) {
      result.defaultValue = paramCfg.default;
    } else if (fieldName === 'format') {
      result.defaultValue = 'json';
    }

    if (description) {
      result.description = description;
    }

    return result;
  }

  paramTypeToGraphQL(
    paramCfg: ElasticParamConfigT,
    fieldName: string
  ): GraphQLInputType {
    switch (paramCfg.type) {
      case 'string':
        return GraphQLString;
      case 'boolean':
        return GraphQLBoolean;
      case 'number':
        return GraphQLFloat;
      case 'time':
        return GraphQLString;
      case 'list':
        return GraphQLJSON;
      case 'enum':
        // $FlowFixMe
        if (Array.isArray(paramCfg.options)) {
          return this.getEnumType(fieldName, paramCfg.options);
        }
        return GraphQLString;
      case undefined:
        // some fields may not have type definition in API file,
        // eg '@param {anything} params.operationThreading - ?'
        return GraphQLJSON;
      default:
        // console.log(
        //   // eslint-disable-line
        //   `New type '${paramCfg.type}' in elastic params setting for field ${fieldName}.`
        // );
        return GraphQLJSON;
    }
  }

  getEnumType(fieldName: string, vals: string[]): GraphQLEnumType {
    const key = fieldName;
    const subKey = JSON.stringify(vals);

    if (!this.cachedEnums[key]) {
      this.cachedEnums[key] = {};
    }

    if (!this.cachedEnums[key][subKey]) {
      const values = vals.reduce(
        (result, val) => {
          if (val === '') {
            result.empty_string = { value: '' };
          } else if (Number.isFinite(val)) {
            result[`number_${val}`] = { value: val };
          } else {
            result[val] = { value: val };
          }
          return result;
        },
        {}
      );

      let postfix = Object.keys(this.cachedEnums[key]).length;
      if (postfix === 0) postfix = '';
      else postfix = `_${postfix}`;

      this.cachedEnums[key][subKey] = new GraphQLEnumType({
        name: `${this.prefix}Enum_${upperFirst(fieldName)}${postfix}`,
        values,
      });
    }

    return this.cachedEnums[key][subKey];
  }

  settingsToArgMap(
    settings: ?ElasticCaSettingsT,
    descriptions: ElasticParsedArgsDescriptionsT = {}
  ): GraphQLFieldConfigArgumentMap {
    const result = {};
    const { params, urls, url, method, needBody } = settings || {};

    if (method === 'POST' || method === 'PUT') {
      result.body = {
        type: needBody ? new GraphQLNonNull(GraphQLJSON) : GraphQLJSON,
      };
    }

    if (params) {
      Object.keys(params).forEach(k => {
        const fieldConfig = this.paramToGraphQLArgConfig(
          params[k],
          k,
          descriptions[k]
        );
        if (fieldConfig) {
          result[k] = fieldConfig;
        }
      });
    }

    const urlList = urls || (url ? [url] : null);

    if (Array.isArray(urlList)) {
      urlList.forEach(item => {
        if (item.req) {
          Object.keys(item.req).forEach(k => {
            const fieldConfig = this.paramToGraphQLArgConfig(
              item.req[k],
              k,
              descriptions[k]
            );
            if (fieldConfig) {
              result[k] = fieldConfig;
            }
          });
        }
      });
    }

    return result;
  }

  reassembleNestedFields(fields: GraphQLFieldMap<*, *>): GraphQLFieldMap<*, *> {
    const result = {};
    Object.keys(fields).forEach(k => {
      const names = k.split('.');
      if (names.length === 1) {
        result[names[0]] = fields[k];
      } else {
        if (!result[names[0]]) {
          result[names[0]] = {
            type: new GraphQLObjectType({
              name: `${this.prefix}Methods_${upperFirst(names[0])}`,
              // $FlowFixMe
              fields: () => {},
            }),
            resolve: () => {
              return {};
            },
          };
        }
        TypeComposer.create(result[names[0]].type).setField(
          names[1],
          fields[k]
        );
      }
    });

    return result;
  }
}
