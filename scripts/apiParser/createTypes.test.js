/* @flow */

// import fs from 'fs';
import path from 'path';
import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLEnumType,
} from 'graphql';
import { GraphQLJSON, upperFirst } from 'graphql-compose';

import {
  loadApiFile,
  parseSource,
  cleanupDescription,
  cleanupParamName,
  codeToSettings,
  settingsToParams,
  paramTypeToGraphQL,
  paramToGraphQLArgConfig,
} from './createTypes';

const apiPartialPath = path.resolve(__dirname, '__mocks__/apiPartial.js');
const apiPartialSource = loadApiFile(apiPartialPath);

const code = `
api.cat.prototype.allocation = ca({
  params: {
    format: { type: 'string' },
    bytes: { type: 'enum', options: ['b', 'k', 'kb'] },
    local: { type: 'boolean' },
    masterTimeout: { type: 'time', name: 'master_timeout' },
    h: { type: 'list' },
    help: { type: 'boolean', 'default': false },
    v: { type: 'boolean', 'default': false }
  },
  urls: [
    {
      fmt: '/_cat/allocation/<%=nodeId%>',
      req: { nodeId: { type: 'list' }}
    }, {
      fmt: '/_cat/allocation'
    }, {
      fmt: '/<%=index%>/<%=type%>/_update_by_query',
      req: {
        index: {
          type: 'list'
        },
        type: {
          type: 'list'
        }
      }
    }, {
      fmt: '/<%=index%>/_update_by_query',
      req: {
        index: {
          type: 'list'
        }
      }
    }
  ]
});`;

// const elastic53 = fs.readFileSync(path.resolve(__dirname, '../../node_modules/elasticsearch/src/lib/apis/5_x.js'), 'utf8');
// const t = fs.readFileSync(
//   path.resolve(__dirname, '__mocks__/apiPartial.js'),
//   'utf8'
// );
// console.log(t);

describe('API Parser: method', () => {
  describe('loadApiFile()', () => {
    it('should load file with data', () => {
      expect(apiPartialSource).toContain('api.search = ca({');
    });

    it('should replace invalid markup', () => {
      expect(apiPartialSource).not.toContain(
        '@param {<<api-param-type-string,`String`>>} params.analyzer - The analyzer to use for the query string'
      );
      expect(apiPartialSource).toContain(
        '@param {String} params.analyzer - The analyzer to use for the query string'
      );
    });
  });

  describe('parseSource()', () => {
    it('should throw error if empty source', () => {
      expect(() => {
        parseSource('');
      }).toThrowError('Empty source');
      expect(() => {
        // $FlowFixMe
        parseSource(123);
      }).toThrowError('should be non-empty string');
    });

    it('should throw error nothing parsed', () => {
      parseSource(apiPartialSource);
    });
  });

  describe('cleanupDescription()', () => {
    it('should remove `- ` from start and trim', () => {
      expect(cleanupDescription('- Some param  ')).toEqual('Some param');
    });
  });

  describe('cleanupParamName()', () => {
    it('should remove `param.` from start', () => {
      expect(cleanupParamName('param.q')).toEqual('q');
    });
  });

  describe('codeToSettings()', () => {
    it('should return settings as object from ca({ settings })', () => {
      expect(codeToSettings(code)).toMatchObject({
        params: {
          bytes: { options: ['b', 'k', 'kb'], type: 'enum' },
          format: { type: 'string' },
          h: { type: 'list' },
          help: { default: false, type: 'boolean' },
          local: { type: 'boolean' },
          masterTimeout: { name: 'master_timeout', type: 'time' },
          v: { default: false, type: 'boolean' },
        },
        urls: [
          {
            fmt: '/_cat/allocation/<%=nodeId%>',
            req: { nodeId: { type: 'list' } },
          },
          { fmt: '/_cat/allocation' },
          {
            fmt: '/<%=index%>/<%=type%>/_update_by_query',
            req: {
              index: { type: 'list' },
              type: { type: 'list' },
            },
          },
          {
            fmt: '/<%=index%>/_update_by_query',
            req: { index: { type: 'list' } },
          },
        ],
      });
    });
  });

  describe('settingsToParams()', () => {
    it('should traverse params', () => {
      expect(
        settingsToParams({
          params: {
            q: {
              type: 'string',
            },
            format: { type: 'string' },
          },
          urls: [],
        })
      ).toMatchObject({ format: {}, q: {} });
    });

    it('should traverse urls[].req params', () => {
      expect(
        settingsToParams({
          params: {},
          urls: [
            {
              fmt: '/_cat/allocation/<%=nodeId%>',
              req: { nodeId: { type: 'list' } },
            },
            {
              fmt: '/<%=index%>/_update_by_query',
              req: {
                index: {
                  type: 'list',
                },
              },
            },
          ],
        })
      ).toMatchObject({ nodeId: {}, index: {} });
    });
  });

  describe('paramTypeToGraphQL()', () => {
    it('should convert scalar types', () => {
      expect(paramTypeToGraphQL({ type: 'string' }, 'f1')).toEqual(
        GraphQLString
      );
      expect(paramTypeToGraphQL({ type: 'boolean' }, 'f1')).toEqual(
        GraphQLBoolean
      );
      expect(paramTypeToGraphQL({ type: 'number' }, 'f1')).toEqual(
        GraphQLFloat
      );
      expect(paramTypeToGraphQL({ type: 'time' }, 'f1')).toEqual(GraphQLString);
    });

    it('should `list` convert to GraphQLJSON', () => {
      expect(paramTypeToGraphQL({ type: 'list' }, 'f1')).toEqual(GraphQLJSON);
    });

    it('should `enum` convert to GraphQLString (if empty options)', () => {
      expect(paramTypeToGraphQL({ type: 'enum' }, 'f1')).toEqual(GraphQLString);
    });

    it('should `enum` convert to GraphQLEnumType', () => {
      const type = paramTypeToGraphQL(
        { type: 'enum', options: ['AND', 'OR'] },
        'f1'
      );
      expect(type).toBeInstanceOf(GraphQLEnumType);
      // $FlowFixMe
      expect(type._values[0]).toMatchObject({ name: 'AND', value: 'AND'});
      // $FlowFixMe
      expect(type._values[1]).toMatchObject({ name: 'OR', value: 'OR'});
    });

    it('should as folback type return GraphQLJSON', () => {
      expect(paramTypeToGraphQL({ type: 'crazy' }, 'f1')).toEqual(GraphQLJSON);
    });
  });

  describe('paramToGraphQLArgConfig()', () => {
    it('should return object with type property', () => {
      expect(paramToGraphQLArgConfig({ type: 'string' }, 'f1')).toMatchObject({
        type: GraphQLString,
      });
    });

    it('should return object with defaultValue property', () => {
      expect(paramToGraphQLArgConfig({ type: 'string', default: 'ABC' }, 'f1')).toMatchObject({
        type: GraphQLString,
        defaultValue: 'ABC',
      });
    });
  });
});
