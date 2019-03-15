/* @flow */

import { Resolver } from 'graphql-compose';
import createFindByIdResolver from '../findById';
import elasticClient from '../../__mocks__/elasticClient';
import { CvTC, CvFieldMap } from '../../__mocks__/cv';

const findByIdResolver = createFindByIdResolver(CvFieldMap, CvTC, {
  elasticClient,
  elasticIndex: 'cv',
  elasticType: 'cv',
});

describe('findById', () => {
  it('return instance of Resolver', () => {
    expect(findByIdResolver).toBeInstanceOf(Resolver);
  });

  it('check args', () => {
    expect(findByIdResolver.hasArg('id')).toBeTruthy();
  });

  it('resolve', async () => {
    await findByIdResolver
      .resolve({ args: { id: '4554' }, context: { elasticClient } })
      .then(res => {
        console.log(res); // eslint-disable-line
      })
      .catch(e => {
        expect(e).toMatchObject({ message: /unknown error/ });
      });
  });
});
