/* @flow */

import { Resolver, schemaComposer } from 'graphql-compose';
import createFindByIdResolver from '../findById';
import elasticClient from '../../__mocks__/elasticClient';
import { CvTC, CvFieldMap } from '../../__mocks__/cv';
import { prepareCommonOpts } from '../../utils';

const findByIdResolver = createFindByIdResolver(
  prepareCommonOpts(schemaComposer, {
    sourceTC: CvTC,
    fieldMap: CvFieldMap,
    elasticClient,
    elasticIndex: 'cv',
    elasticType: 'cv',
  })
);

beforeEach(() => {
  schemaComposer.clear();
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
