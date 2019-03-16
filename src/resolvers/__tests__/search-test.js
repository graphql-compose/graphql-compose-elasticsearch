/* @flow */

import { Resolver, schemaComposer } from 'graphql-compose';
import createSearchResolver, * as Search from '../search';
import elasticClient from '../../__mocks__/elasticClient';
import { CvTC, CvFieldMap } from '../../__mocks__/cv';
import { prepareCommonOpts } from '../../utils';

const opts = prepareCommonOpts(schemaComposer, {
  sourceTC: CvTC,
  fieldMap: CvFieldMap,
  elasticClient,
  elasticIndex: 'cv',
  elasticType: 'cv',
});

beforeEach(() => {
  schemaComposer.clear();
});

describe('search resolver', () => {
  it('should return Resolver', () => {
    expect(createSearchResolver(opts)).toBeInstanceOf(Resolver);
  });

  describe('Resolver.resolve', () => {
    const SearchResolver = createSearchResolver(opts);

    it.skip('should return result', () => {
      return SearchResolver.resolve({}).then(res => {
        console.log(res); // eslint-disable-line
      });
    });
  });

  describe('helper methods', () => {
    it('toDottedList()', () => {
      expect(Search.toDottedList({ a: { b: true, c: { e: true } }, d: true })).toEqual([
        'a.b',
        'a.c.e',
        'd',
      ]);
      expect(Search.toDottedList({})).toEqual(true);
    });
  });
});
