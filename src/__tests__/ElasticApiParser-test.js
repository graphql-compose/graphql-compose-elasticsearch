/* @flow */

// import fs from 'fs';
import dox from 'dox';
import path from 'path';
import {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql';
import { GraphQLJSON, TypeComposer } from 'graphql-compose';

import ElasticApiParser from './ElasticApiParser';

const apiPartialPath = path.resolve(__dirname, '__mocks__/apiPartial.js');
const apiPartialSource = new ElasticApiParser().loadApiFile(apiPartialPath);

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

describe('ElasticApiParser', () => {
  let parser;

  beforeEach(() => {
    parser = new ElasticApiParser();
  });

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

  describe('cleanupDescription()', () => {
    it('should remove `- ` from start and trim', () => {
      expect(parser.cleanupDescription('- Some param  ')).toEqual('Some param');
    });
  });

  describe('cleanupParamName()', () => {
    it('should remove `params.` from start', () => {
      expect(parser.cleanupParamName('params.q')).toEqual('q');
    });
  });

  describe('parseParamsDescription()', () => {
    it('should return descriptions for fields', () => {
      const source = parser.cleanUpSource(
        `
      /**
       * Perform a [updateByQuery](https://www.elastic.co/guide/en/elasticsearch/reference/5.x/docs-update-by-query.html) request
       *
       * @param {Object} params - An object with parameters used to carry out this action
       * @param {<<api-param-type-string,\`String\`>>} params.analyzer - The analyzer to use for the query string
       * @param {<<api-param-type-boolean,\`Boolean\`>>} params.analyzeWildcard - Specify whether wildcard and prefix queries should be analyzed (default: false)
       * @param {<<api-param-type-number,\`Number\`>>} params.from - Starting offset (default: 0)
       */
      api.updateByQuery = ca({});
      `
      );
      const doxAST = dox.parseComments(source, { raw: true });
      expect(parser.parseParamsDescription(doxAST[0])).toMatchObject({
        analyzeWildcard: 'Specify whether wildcard and prefix queries should be analyzed (default: false)',
        analyzer: 'The analyzer to use for the query string',
        from: 'Starting offset (default: 0)',
      });
    });
  });

  describe('codeToSettings()', () => {
    it('should return settings as object from ca({ settings })', () => {
      expect(parser.codeToSettings(code)).toMatchObject({
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

  describe('paramTypeToGraphQL()', () => {
    it('should convert scalar types', () => {
      expect(parser.paramTypeToGraphQL({ type: 'string' }, 'f1')).toEqual(
        GraphQLString
      );
      expect(parser.paramTypeToGraphQL({ type: 'boolean' }, 'f1')).toEqual(
        GraphQLBoolean
      );
      expect(parser.paramTypeToGraphQL({ type: 'number' }, 'f1')).toEqual(
        GraphQLFloat
      );
      expect(parser.paramTypeToGraphQL({ type: 'time' }, 'f1')).toEqual(
        GraphQLString
      );
    });

    it('should `list` convert to GraphQLJSON', () => {
      expect(parser.paramTypeToGraphQL({ type: 'list' }, 'f1')).toEqual(
        GraphQLJSON
      );
    });

    it('should `enum` convert to GraphQLString (if empty options)', () => {
      expect(parser.paramTypeToGraphQL({ type: 'enum' }, 'f1')).toEqual(
        GraphQLString
      );
    });

    it('should `enum` convert to GraphQLEnumType', () => {
      const type = parser.paramTypeToGraphQL(
        { type: 'enum', options: ['AND', 'OR'] },
        'f1'
      );
      expect(type).toBeInstanceOf(GraphQLEnumType);
    });

    it('should as folback type return GraphQLJSON', () => {
      expect(parser.paramTypeToGraphQL({ type: 'crazy' }, 'f1')).toEqual(
        GraphQLJSON
      );
    });
  });

  describe('getEnumType()', () => {
    it('should convert to GraphQLEnumType', () => {
      const type = parser.getEnumType('f1', ['AND', 'OR']);
      expect(type).toBeInstanceOf(GraphQLEnumType);
      // $FlowFixMe
      expect(type._values[0]).toMatchObject({ name: 'AND', value: 'AND' });
      // $FlowFixMe
      expect(type._values[1]).toMatchObject({ name: 'OR', value: 'OR' });
    });

    it("should convert '' to empty_string", () => {
      const type = parser.getEnumType('f1', ['']);
      expect(type).toBeInstanceOf(GraphQLEnumType);
      // $FlowFixMe
      expect(type._values[0]).toMatchObject({
        name: 'empty_string',
        value: '',
      });
    });

    it('should convert 1 to number_1', () => {
      const type = parser.getEnumType('f1', [1]);
      expect(type).toBeInstanceOf(GraphQLEnumType);
      // $FlowFixMe
      expect(type._values[0]).toMatchObject({ name: 'number_1', value: 1 });
    });

    it('should provide name started with ElasticEnum', () => {
      const type = parser.getEnumType('f1', ['']);
      expect(type.name).toMatch(/^ElasticEnum/);
    });

    it('should reuse generated Enums', () => {
      const type = parser.getEnumType('f1', ['']);
      const type2 = parser.getEnumType('f1', ['']);
      const type3 = parser.getEnumType('f2', ['']);
      expect(type).toBe(type2);
      expect(type).not.toBe(type3);
    });

    it('should generated different name for Enums', () => {
      const type = parser.getEnumType('f1', ['a', 'b']);
      const type2 = parser.getEnumType('f1', ['c', 'd']);
      expect(type).not.toBe(type2);
      expect(type.name).toMatch(/F1$/);
      expect(type2.name).toMatch(/F1_1$/);
    });
  });

  describe('paramToGraphQLArgConfig()', () => {
    it('should return object with type property', () => {
      expect(
        parser.paramToGraphQLArgConfig({ type: 'string' }, 'f1')
      ).toMatchObject({
        type: GraphQLString,
      });
    });

    it('should return object with defaultValue property', () => {
      expect(
        parser.paramToGraphQLArgConfig({ type: 'string', default: 'ABC' }, 'f1')
      ).toMatchObject({
        type: GraphQLString,
        defaultValue: 'ABC',
      });
    });
  });

  describe('settingsToArgMap()', () => {
    it('should traverse params', () => {
      expect(
        parser.settingsToArgMap({
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
        parser.settingsToArgMap({
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

    it('should traverse url.req params', () => {
      expect(
        parser.settingsToArgMap({
          params: {},
          url: {
            fmt: '/_cat/allocation/<%=nodeId%>',
            req: { nodeId: { type: 'list' } },
          },
        })
      ).toMatchObject({ nodeId: {} });
    });
  });

  describe('getMethodName()', () => {
    it('should return string', () => {
      expect(parser.getMethodName('api.updateByQuery')).toEqual(
        'updateByQuery'
      );
    });

    it('should return array of string', () => {
      expect(parser.getMethodName('api.cat.prototype.allocation')).toEqual([
        'cat',
        'allocation',
      ]);
    });
  });

  describe('reassembleNestedFields()', () => {
    it('should pass single fields', () => {
      expect(
        parser.reassembleNestedFields({
          field1: { type: GraphQLString },
          field2: { type: GraphQLString },
        })
      ).toMatchObject({
        field1: { type: GraphQLString },
        field2: { type: GraphQLString },
      });
    });

    it('should combine nested field in GraphQLObjectType', () => {
      const reFields = parser.reassembleNestedFields({
        'cat.prototype.field1': { type: GraphQLString },
        'cat.prototype.field2': { type: GraphQLString },
        'index.prototype.exists': { type: GraphQLBoolean },
      });
      expect(Object.keys(reFields).length).toEqual(2);
      expect(reFields.cat).toBeDefined();
      expect(reFields.cat.type).toBeInstanceOf(GraphQLObjectType);
      // $FlowFixMe
      const tc = TypeComposer.create(reFields.cat.type);
      expect(tc.getFieldNames()).toEqual(['field1', 'field2']);
      expect(tc.getFieldType('field1')).toEqual(GraphQLString);
      expect(tc.getFieldType('field2')).toEqual(GraphQLString);

      expect(reFields.index).toBeDefined();
      expect(reFields.index.type).toBeInstanceOf(GraphQLObjectType);
      // $FlowFixMe
      const tc2 = TypeComposer.create(reFields.index.type);
      expect(tc2.getFieldNames()).toEqual(['exists']);
      expect(tc2.getFieldType('exists')).toEqual(GraphQLBoolean);
    });
  });

  describe('parseSource()', () => {
    it('should throw error if empty source', () => {
      expect(() => {
        parser.parseSource('');
      }).toThrowError('Empty source');
      expect(() => {
        // $FlowFixMe
        parser.parseSource(123);
      }).toThrowError('should be non-empty string');
    });

    it('should return GraphQLInputFieldMap', () => {
      expect(parser.parseSource(apiPartialSource)).toMatchSnapshot();
    });
  });

  // describe('run()', () => {
  //   it('should return GraphQLInputFieldMap for provided Elastic version', () => {
  //     console.dir(parser.run('5_0'));
  //   });
  // });
});
