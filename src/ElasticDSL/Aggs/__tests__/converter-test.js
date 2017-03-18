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
    expect(
      argsBlockConverter({
        body: {
          aggs: [
            { key: 'field1', value: { term: 'a' } },
            { key: 'field2', value: { term: 'b' } },
          ],
        },
      })
    ).toEqual({
      body: {
        aggs: {
          field1: { term: 'a' },
          field2: { term: 'b' },
        },
      },
    });
  });
});
