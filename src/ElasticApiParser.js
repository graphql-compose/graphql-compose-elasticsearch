/* @flow */
/* eslint-disable no-param-reassign, class-methods-use-this  */

import dox from 'dox';
import fs from 'fs';
import path from 'path';
import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql';
import { GraphQLJSON, upperFirst, TypeComposer } from 'graphql-compose';

import type {
  GraphQLArgumentConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldMap,
  GraphQLInputType,
} from 'graphql/type/definition';

export type ElasticApiParserOptsT = {
  version?:
    '5_0'
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
    | '0_90',
  prefix?: string,
  elasticApiFilesPath?: string,
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
};

export default class ElasticApiParser {
  cachedEnums: {
    [fieldName: string]: { [valsStringified: string]: GraphQLEnumType },
  };
  version: string;
  prefix: string;
  elasticApiFilesPath: string;

  constructor(opts: ElasticApiParserOptsT = {}) {
    // derived from installed package `elasticsearch`
    // from ../../node_modules/elasticsearch/src/lib/apis/VERSION.js
    this.version = opts.version || '5_0';
    this.prefix = opts.prefix || 'Elastic';
    this.elasticApiFilesPath = opts.elasticApiFilesPath || './node_modules/elasticsearch/src/lib/apis/';
    this.cachedEnums = {};
  }

  run() {
    this.cachedEnums = {};
    const apiFilePath = path.resolve(this.elasticApiFilesPath, `${this.version}.js`);
    const source = this.loadApiFile(apiFilePath);
    return this.parseSource(source);
  }

  parseSource(source: string): GraphQLFieldMap<*, *> {
    let result = {};

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
        description = this.cleanupDescription(item.description.full);
      }

      // prepare arguments and its descriptions
      const descriptionMap = this.parseParamsDescription(item);
      const argMap = this.settingsToArgMap(this.codeToSettings(item.code));
      Object.keys(argMap).forEach(k => {
        if (descriptionMap[k]) {
          argMap[k].description = descriptionMap[k];
        }
      });

      const elasticMethod = this.getMethodName(item.ctx.string);

      result[item.ctx.string] = {
        type: GraphQLJSON,
        description,
        args: argMap,
        resolve: (src, args, context) => {
          if (!context.elasticClient) {
            throw new Error(
              'You should provide `elasticClient` to GraphQL context'
            );
          }

          if (Array.isArray(elasticMethod)) {
            return context.elasticClient[elasticMethod[0]][elasticMethod[1]](
              args
            );
          }

          return context.elasticClient[elasticMethod](args);
        },
      };
    });

    // reassamle nested methods, eg api.cat.prototype.allocation
    result = this.reassembleNestedFields(result);

    return result;
  }

  loadApiFile(absolutePath: string): string {
    const code = fs.readFileSync(absolutePath, 'utf8');
    return this.cleanUpSource(code);
  }

  cleanUpSource(code: string): string {
    // remove invalid markup
    // {<<api-param-type-boolean,`Boolean`>>} converted to {Boolean}
    const codeCleaned = code.replace(/{<<.+`(.*)`.+}/gi, '{$1}');

    return codeCleaned;
  }

  parseParamsDescription(doxItemAST: any): { [fieldName: string]: string } {
    const descriptions = {};
    if (Array.isArray(doxItemAST.tags)) {
      doxItemAST.tags.forEach(tag => {
        if (!tag || tag.type !== 'param') return;
        if (tag.name === 'params') return;

        const name = this.cleanupParamName(tag.name);
        if (!name) return;

        descriptions[name] = this.cleanupDescription(tag.description);
      });
    }
    return descriptions;
  }

  cleanupDescription(str: ?string): ?string {
    if (typeof str === 'string') {
      if (str.startsWith('- ')) {
        str = str.substr(2);
      }
      str = str.trim();

      return str;
    }
    return undefined;
  }

  cleanupParamName(str: ?string): ?string {
    if (typeof str === 'string') {
      if (str.startsWith('params.')) {
        str = str.substr(7);
      }
      str = str.trim();

      return str;
    }
    return undefined;
  }

  codeToSettings(code: string): ?ElasticCaSettingsT {
    // find code in ca({});
    const reg = /ca\((\{(.|\n)+\})\);/g;
    const matches = reg.exec(code);
    if (matches && matches[1]) {
      return eval('(' + matches[1] + ')'); // eslint-disable-line no-eval
    }
    return undefined;
  }

  paramToGraphQLArgConfig(
    paramCfg: ElasticParamConfigT,
    fieldName: string
  ): GraphQLArgumentConfig {
    const result: GraphQLArgumentConfig = {
      type: this.paramTypeToGraphQL(paramCfg, fieldName),
    };
    if (paramCfg.default) {
      result.defaultValue = paramCfg.default;
    } else if(fieldName === 'format') {
      result.defaultValue = 'json';
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
      default:
        console.log(`New type '${paramCfg.type}' in elastic params setting.`); // eslint-disable-line
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
    settings: ?ElasticCaSettingsT
  ): GraphQLFieldConfigArgumentMap {
    const result = {};
    const { params, urls, url } = settings || {};
    if (params) {
      Object.keys(params).forEach(k => {
        const fieldConfig = this.paramToGraphQLArgConfig(params[k], k);
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
            const fieldConfig = this.paramToGraphQLArgConfig(item.req[k], k);
            if (fieldConfig) {
              result[k] = fieldConfig;
            }
          });
        }
      });
    }

    return result;
  }

  getMethodName(str: string): string | string[] {
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

  reassembleNestedFields(fields: GraphQLFieldMap<*, *>): GraphQLFieldMap<*, *> {
    const result = {};
    Object.keys(fields).forEach(k => {
      const name = this.getMethodName(k);
      if (Array.isArray(name)) {
        if (!result[name[0]]) {
          result[name[0]] = {
            type: new GraphQLObjectType({
              name: `${this.prefix}Methods_${upperFirst(name[0])}`,
              // $FlowFixMe
              fields: () => {},
            }),
            resolve: () => { return {}; },
          };
        }
        TypeComposer.create(result[name[0]].type).setField(name[1], fields[k]);
      } else {
        result[name] = fields[k];
      }
    });

    return result;
  }
}
