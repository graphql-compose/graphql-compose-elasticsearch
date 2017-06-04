/* @flow */

// import fs from 'fs';
import dox from 'dox';
import path from 'path';
import { GraphQLJSON, TypeComposer, graphql } from 'graphql-compose';
import ElasticApiParser from '../ElasticApiParser';

const {
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLNonNull,
} = graphql;

const apiPartialPath = path.resolve(__dirname, '../__mocks__/apiPartial.js');

describe('ElasticApiParser', () => {
  let parser;

  beforeEach(() => {
    parser = new ElasticApiParser({
      elasticApiFilePath: apiPartialPath,
    });
  });

  describe('static methods', () => {
    describe('loadApiFile()', () => {
      it('should load file with data', () => {
        expect(ElasticApiParser.loadApiFile(apiPartialPath)).toContain('api.search = ca({');
      });

      it('should replace invalid markup', () => {
        expect(ElasticApiParser.loadApiFile(apiPartialPath)).not.toContain(
          '@param {<<api-param-type-string,`String`>>} params.analyzer - The analyzer to use for the query string'
        );
        expect(ElasticApiParser.loadApiFile(apiPartialPath)).toContain(
          '@param {String} params.analyzer - The analyzer to use for the query string'
        );
      });
    });

    describe('findApiVersionFile()', () => {
      it('should find proper version in elasticsearch 12.x', () => {
        const loadApiListFile = ElasticApiParser.loadApiListFile;
        // $FlowFixMe
        ElasticApiParser.loadApiListFile = () =>
          `
        module.exports = {
          '_default': require('./5_0'),
          '5.0': require('./5_0'),
          '2.4': require('./2_4'),
          '2.1': require('./2_1'),
          '1.7': require('./1_7'),
          '0.90': require('./0_90'),
          '5.x': require('./5_x'),
          'master': require('./master')
        };
        `;

        expect(ElasticApiParser.findApiVersionFile('5.0')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/5_0.js'
        );
        expect(ElasticApiParser.findApiVersionFile('2.4')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/2_4.js'
        );
        expect(ElasticApiParser.findApiVersionFile('1.7')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/1_7.js'
        );
        expect(ElasticApiParser.findApiVersionFile('_default')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/5_0.js'
        );

        // $FlowFixMe
        ElasticApiParser.loadApiListFile = loadApiListFile;
      });

      it('should find proper version in elasticsearch 13.x', () => {
        const loadApiListFile = ElasticApiParser.loadApiListFile;
        // $FlowFixMe
        ElasticApiParser.loadApiListFile = () =>
          `
          module.exports = {
            get '_default'() { return require('./5_3'); },
            get '5.3'() { return require('./5_3'); },
            get '5.2'() { return require('./5_2'); },
            get '5.1'() { return require('./5_1'); },
            get '5.0'() { return require('./5_0'); },
            get '2.4'() { return require('./2_4'); },
            get '1.7'() { return require('./1_7'); },
            get '0.90'() { return require('./0_90'); },
            get '5.x'() { return require('./5_x'); },
            get 'master'() { return require('./master'); },
          };
        `;

        expect(ElasticApiParser.findApiVersionFile('5.0')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/5_0.js'
        );
        expect(ElasticApiParser.findApiVersionFile('2.4')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/2_4.js'
        );
        expect(ElasticApiParser.findApiVersionFile('1.7')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/1_7.js'
        );
        expect(ElasticApiParser.findApiVersionFile('_default')).toMatch(
          // $FlowFixMe
          'elasticsearch/src/lib/apis/5_3.js'
        );

        // $FlowFixMe
        ElasticApiParser.loadApiListFile = loadApiListFile;
      });
    });

    describe('cleanupDescription()', () => {
      it('should remove `- ` from start and trim', () => {
        expect(ElasticApiParser.cleanupDescription('- Some param  ')).toEqual('Some param');
      });
    });

    describe('cleanupParamName()', () => {
      it('should remove `params.` from start', () => {
        expect(ElasticApiParser.cleanupParamName('params.q')).toEqual('q');
      });
    });

    describe('cleanUpSource()', () => {
      it('should {<<api-param-type-boolean,`Boolean`>>} convert to {Boolean}', () => {
        expect(
          ElasticApiParser.cleanUpSource(
            `@param {<<api-param-type-boolean,\`Boolean\`>>} params.analyzeWildcard`
          )
        ).toEqual(`@param {Boolean} params.analyzeWildcard`);
      });

      it("should api['delete'] convert to api.delete", () => {
        expect(ElasticApiParser.cleanUpSource(`api.indices.prototype['delete'] = ca({`)).toEqual(
          `api.indices.prototype.delete = ca({`
        );
      });
    });

    describe('parseParamsDescription()', () => {
      it('should return descriptions for fields', () => {
        const source = ElasticApiParser.cleanUpSource(
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
        expect(ElasticApiParser.parseParamsDescription(doxAST[0])).toMatchObject({
          analyzeWildcard: 'Specify whether wildcard and prefix queries should be analyzed (default: false)',
          analyzer: 'The analyzer to use for the query string',
          from: 'Starting offset (default: 0)',
        });
      });
    });

    describe('codeToSettings()', () => {
      it('should return settings as object from ca({ settings })', () => {
        expect(
          ElasticApiParser.codeToSettings(
            `
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
        });`
          )
        ).toMatchObject({
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

    describe('getMethodName()', () => {
      it('should return string', () => {
        expect(ElasticApiParser.getMethodName('api.updateByQuery')).toEqual('updateByQuery');
      });

      it('should return array of string', () => {
        expect(ElasticApiParser.getMethodName('api.cat.prototype.allocation')).toEqual([
          'cat',
          'allocation',
        ]);
      });
    });

    describe('parseSource()', () => {
      it('should throw error if empty source', () => {
        expect(() => {
          ElasticApiParser.parseSource('');
        }).toThrowError('Empty source');
        expect(() => {
          // $FlowFixMe
          ElasticApiParser.parseSource(123);
        }).toThrowError('should be non-empty string');
      });

      it('should return ElasticParsedSourceT', () => {
        expect(
          ElasticApiParser.parseSource(ElasticApiParser.loadApiFile(apiPartialPath))
        ).toMatchSnapshot();
      });
    });
  });

  describe('paramTypeToGraphQL()', () => {
    it('should convert scalar types', () => {
      expect(parser.paramTypeToGraphQL({ type: 'string' }, 'f1')).toEqual(GraphQLString);
      expect(parser.paramTypeToGraphQL({ type: 'boolean' }, 'f1')).toEqual(GraphQLBoolean);
      expect(parser.paramTypeToGraphQL({ type: 'number' }, 'f1')).toEqual(GraphQLFloat);
      expect(parser.paramTypeToGraphQL({ type: 'time' }, 'f1')).toEqual(GraphQLString);
    });

    it('should `list` convert to GraphQLJSON', () => {
      expect(parser.paramTypeToGraphQL({ type: 'list' }, 'f1')).toEqual(GraphQLJSON);
    });

    it('should `enum` convert to GraphQLString (if empty options)', () => {
      expect(parser.paramTypeToGraphQL({ type: 'enum' }, 'f1')).toEqual(GraphQLString);
    });

    it('should `enum` convert to GraphQLEnumType', () => {
      const type = parser.paramTypeToGraphQL({ type: 'enum', options: ['AND', 'OR'] }, 'f1');
      expect(type).toBeInstanceOf(GraphQLEnumType);
    });

    it('should as fallback type return GraphQLJSON', () => {
      expect(parser.paramTypeToGraphQL({ type: 'crazy' }, 'f1')).toEqual(GraphQLJSON);
    });
  });

  describe('getEnumType()', () => {
    it('should convert to GraphQLEnumType', () => {
      const type = parser.getEnumType('f1', ['AND', 'OR']);
      expect(type).toBeInstanceOf(GraphQLEnumType);
      expect(type._values[0]).toMatchObject({ name: 'AND', value: 'AND' });
      expect(type._values[1]).toMatchObject({ name: 'OR', value: 'OR' });
    });

    it("should convert '' to empty_string", () => {
      const type = parser.getEnumType('f1', ['']);
      expect(type).toBeInstanceOf(GraphQLEnumType);
      expect(type._values[0]).toMatchObject({
        name: 'empty_string',
        value: '',
      });
    });

    it('should convert `true` to `true_value` (same for `false`)', () => {
      // This is fix for https://github.com/graphql/graphql-js/pull/812
      // Which throw error on `true`, `false` and `null`.
      // But we allow to use this values, just renaming it.
      const type = parser.getEnumType('f1', ['true', true, 'false', false]);
      expect(type).toBeInstanceOf(GraphQLEnumType);
      expect(type._values[0]).toMatchObject({
        name: 'true_string',
        value: 'true',
      });
      expect(type._values[1]).toMatchObject({
        name: 'true_boolean',
        value: true,
      });
      expect(type._values[2]).toMatchObject({
        name: 'false_string',
        value: 'false',
      });
      expect(type._values[3]).toMatchObject({
        name: 'false_boolean',
        value: false,
      });
    });

    it('should convert 1 to number_1', () => {
      const type = parser.getEnumType('f1', [1]);
      expect(type).toBeInstanceOf(GraphQLEnumType);
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
      expect(parser.paramToGraphQLArgConfig({ type: 'string' }, 'f1')).toMatchObject({
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

    it('should set defaultValue="json" for `format` argument', () => {
      expect(parser.paramToGraphQLArgConfig({ type: 'string' }, 'format')).toMatchObject({
        type: GraphQLString,
        defaultValue: 'json',
      });
    });
  });

  describe('settingsToArgMap()', () => {
    it('should create body arg if POST or PUT method', () => {
      const args = parser.settingsToArgMap({
        params: {},
        method: 'POST',
      });
      expect(args).toMatchObject({ body: {} });
      expect(args.body.type).toEqual(GraphQLJSON);
    });

    it('should create required body arg if POST or PUT method', () => {
      const args = parser.settingsToArgMap({
        params: {},
        method: 'POST',
        needBody: true,
      });
      expect(args).toMatchObject({ body: {} });
      expect(args.body.type).toBeInstanceOf(GraphQLNonNull);
    });

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

  describe('reassembleNestedFields()', () => {
    it('should pass single fields', () => {
      expect(
        // $FlowFixMe
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
      // $FlowFixMe
      const reFields = parser.reassembleNestedFields({
        'cat.field1': { type: GraphQLString },
        'cat.field2': { type: GraphQLString },
        'index.exists': { type: GraphQLBoolean },
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

  describe('generateFieldConfig()', () => {
    it('should throw error if provided empty method name', () => {
      expect(() => {
        // $FlowFixMe
        parser.generateFieldConfig();
      }).toThrowError('provide Elastic search method');
    });

    it('should throw error if requested method does not exist', () => {
      expect(() => {
        parser.generateFieldConfig('missing.method');
      }).toThrowError('does not exists');
    });

    it('should generate fieldConfig', () => {
      const partialApiParser = new ElasticApiParser({
        elasticApiFilePath: apiPartialPath,
      });
      expect(partialApiParser.generateFieldConfig('search')).toMatchSnapshot();
      expect(partialApiParser.generateFieldConfig('cat.allocation')).toMatchSnapshot();
    });
  });

  describe('generateFieldMap()', () => {
    it('should generate fieldMap', () => {
      const partialApiParser = new ElasticApiParser({
        elasticApiFilePath: apiPartialPath,
      });
      expect(partialApiParser.generateFieldMap()).toMatchSnapshot();
    });
  });
});
