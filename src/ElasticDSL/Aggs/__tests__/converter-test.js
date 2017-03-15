import argsBlockConverter, {
  convertAggsBlocks,
  convertAggsRules,
} from '../converter';

describe('AGGS args converter', () => {
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
      convertAggsBlocks([
        { key: 'field1', value: { aggs: [{ key: 'field2', value: {} }] } },
      ])
    ).toEqual({ field1: { aggs: { field2: {} } } });
  });

  it('argsBlockConverter()', () => {
    expect.assertions(4);
    const mockResolve = (source, args, context, info) => {
      expect(args.body.aggs).toEqual({
        field1: {},
        field2: {},
      });
      expect(source).toEqual('source');
      expect(context).toEqual('context');
      expect(info).toEqual('info');
    };

    const args = {
      body: {
        aggs: [{ key: 'field1', value: {} }, { key: 'field2', value: {} }],
      },
    };
    argsBlockConverter(mockResolve)('source', args, 'context', 'info');
  });
});
