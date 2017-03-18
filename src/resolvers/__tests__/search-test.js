import { Resolver } from 'graphql-compose';
import createSearchResolver from '../search';
import elasticClient from '../../__mocks__/elasticClient';
import { CvTC, CvFieldMap } from '../../__mocks__/cv';

describe('search resolver', () => {
  it('should return Resolver', () => {
    expect(
      createSearchResolver(CvFieldMap, CvTC, elasticClient)
    ).toBeInstanceOf(Resolver);
  });

  describe('Resolver.resolve', () => {
    const SearchResolver = createSearchResolver(
      CvFieldMap,
      CvTC,
      elasticClient
    );

    it.skip('should return result', () => {
      return SearchResolver.resolve({}, {}, {}).then(res => {
        console.log(res);
      });
    });
  });
});
