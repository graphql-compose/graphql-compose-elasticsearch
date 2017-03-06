/* @flow */
/* eslint-disable no-param-reassign */

import dox from 'dox';
import fs from 'fs';
import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLEnumType,
} from 'graphql';
import { GraphQLJSON, upperFirst } from 'graphql-compose';

import type { GraphQLArgumentConfig } from 'graphql/type/definition';

export type ElasticParamConfigT = {
  type: string,
  name?: string,
  options?: mixed,
  default?: mixed,
};

export type ElasticCaSettingsT = {
  params: {
    [name: string]: ElasticParamConfigT,
  },
  urls: {
    fmt: string,
    req: {
      [name: string]: ElasticParamConfigT,
    },
  }[],
};

export const apiSources = {
  elastic5: '../../node_modules/elasticsearch/src/lib/apis/5_x.js',
};

export function loadApiFile(absolutePath: string): string {
  const str = fs.readFileSync(absolutePath, 'utf8');

  // remove invalid markup
  // {<<api-param-type-boolean,`Boolean`>>} converted to {Boolean}
  const strCleaned = str.replace(/{<<.+`(.*)`.+}/gi, '{$1}');

  return strCleaned;
}

export function parseSource(source: string) {
  const result = {};

  if (!source || typeof source !== 'string') {
    throw Error('Empty source. It should be non-empty string.');
  }

  const parsed = dox.parseComments(source, { raw: true });
  if (!parsed || !Array.isArray(parsed)) {
    throw Error('Incorrect responce from dox.parseComments');
  }

  parsed.forEach(item => {
    if (!item.ctx || !item.ctx.string) {
      return;
    }

    let description;
    if (item.description && item.description.full) {
      description = cleanupDescription(item.description.full);
    }

    const params = {};
    if (Array.isArray(item.tags)) {
      item.tags.forEach(tag => {
        if (!tag || tag.type !== 'param') return;
        if (tag.name === 'params') return;

        const name = cleanupParamName(tag.name);
        if (!name) return;

        params[name] = {
          name,
          description: cleanupDescription(tag.description),
        };
      });
    }

    // parseParamsFromCode(item.code);

    result[item.ctx.string] = {
      description,
      params,
    };
  });

  // console.dir(parsed, {depth: 4, colors: 1})

  return result;
}

export function cleanupDescription(str: ?string): ?string {
  if (typeof str === 'string') {
    if (str.startsWith('- ')) {
      str = str.substr(2);
    }
    str = str.trim();

    return str;
  }
  return undefined;
}

export function cleanupParamName(str: ?string): ?string {
  if (typeof str === 'string') {
    if (str.startsWith('param.')) {
      str = str.substr(6);
    }
    str = str.trim();

    return str;
  }
  return undefined;
}

export function codeToSettings(code: string): mixed {
  // find code in ca({});
  const reg = /ca\((\{(.|\n)+\})\);/g;
  const matches = reg.exec(code);
  if (matches[1]) {
    return eval('(' + matches[1] + ')'); // eslint-disable-line no-eval
  }
  return undefined;
}

export function settingsToParams(settings: ElasticCaSettingsT): mixed {
  const result = {};
  const { params, urls } = settings;
  if (params) {
    Object.keys(params).forEach(k => {
      const fieldConfig = paramToGraphQLArgConfig(params[k], k);
      if (fieldConfig) {
        result[k] = fieldConfig;
      }
    });
  }

  if (Array.isArray(urls)) {
    urls.forEach(url => {
      if (url.req) {
        Object.keys(url.req).forEach(k => {
          const fieldConfig = paramToGraphQLArgConfig(url.req[k], k);
          if (fieldConfig) {
            result[k] = fieldConfig;
          }
        });
      }
    });
  }

  return result;
}

export function paramToGraphQLArgConfig(
  paramCfg: ElasticParamConfigT,
  fieldName: string
): GraphQLArgumentConfig {
  const result: GraphQLArgumentConfig = {
    type: paramTypeToGraphQL(paramCfg, fieldName),
  };
  if (paramCfg.default) {
    result.defaultValue = paramCfg.default;
  }

  return result;
}

export function paramTypeToGraphQL(
  paramCfg: ElasticParamConfigT,
  fieldName: string
): GraphQLInputObjectType {
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
      if (Array.isArray(paramCfg.options)) {
        const values = paramCfg.options.reduce(
          (result, val) => {
            // $FlowFixMe
            result[val] = { value: val }; // eslint-disable-line no-param-reassign
            return result;
          },
          {}
        );

        return new GraphQLEnumType({
          name: `Elastic${upperFirst(fieldName)}`,
          values,
        });
      }
      return GraphQLString;
    default:
      console.log(`New type '${paramCfg.type}' in elastic params setting.`); // eslint-disable-line
      return GraphQLJSON;
  }
}
