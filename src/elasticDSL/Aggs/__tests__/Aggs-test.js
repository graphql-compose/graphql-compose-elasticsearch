/* @flow */

import { schemaComposer, graphql } from 'graphql-compose';
import { getAggsITC, prepareAggsInResolve, convertAggsBlocks, convertAggsRules } from '../Aggs';
import { prepareCommonOpts } from '../../../utils';

const { printSchema } = graphql;

beforeEach(() => {
  schemaComposer.clear();
});

describe('AGGS args converter', () => {
  it('Aggs DSL', () => {
    schemaComposer.Query.addFields({
      search: {
        args: {
          body: {
            type: getAggsITC(
              prepareCommonOpts(schemaComposer, {
                prefix: 'Elastic_',
                postfix: '_50',
              })
            ),
          },
        },
        type: 'Int',
      },
    });
    const schema = schemaComposer.buildSchema();
    expect(printSchema(schema)).toMatchSnapshot();
  });

  it('convertAggsRules()', () => {
    expect(convertAggsRules({ some: { field: 1 } })).toEqual({
      some: { field: 1 },
    });
  });

  it('convertAggsBlocks()', () => {
    expect(
      convertAggsBlocks([
        { key: 'field1', value: {} },
        { key: 'field2', value: {} },
      ])
    ).toEqual({
      field1: {},
      field2: {},
    });
  });

  it('should convert recursively aggs', () => {
    expect(
      convertAggsBlocks([{ key: 'field1', value: { aggs: [{ key: 'field2', value: {} }] } }])
    ).toEqual({ field1: { aggs: { field2: {} } } });
  });

  it('prepareAggsInResolve()', () => {
    expect(
      prepareAggsInResolve([
        { key: 'field1', value: { term: 'a' } },
        { key: 'field2', value: { term: 'b' } },
      ])
    ).toEqual({
      field1: { term: 'a' },
      field2: { term: 'b' },
    });
  });
});
