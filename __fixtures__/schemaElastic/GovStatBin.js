// @flow
/* eslint-disable no-param-reassign */

import { composeWithElastic } from '../../src/index';
import elasticClient from './elasticClient';

export const govStatBinMapping = {
  name: { type: 'keyword', boost: 5 },
  nameKZ: { type: 'keyword', boost: 5 },
  regAt: { type: 'date' },
  code1: { type: 'double' },
  code2: { type: 'keyword' },
  act: { type: 'text' },
  crp: { type: 'double' },
  size: { type: 'keyword' },
  cato: { type: 'double' },
  loc: { type: 'keyword' },
  addr: { type: 'keyword' },
  chef: { type: 'keyword' },
  id_keyword: { type: 'keyword', boost: 10 },
  shortName: { type: 'keyword', boost: 7 },
};

export const GovStatBinEsTC = composeWithElastic({
  graphqlTypeName: 'GovStatBinEsTC',
  elasticIndex: 'bin',
  elasticType: 'bin',
  elasticMapping: {
    properties: govStatBinMapping,
  },
  elasticClient,
});

export function getQuery(filter: Object = {}) {
  if (!filter) return null;

  const must = [];

  if (filter.q) {
    must.push({
      function_score: {
        boost_mode: 'multiply',
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: filter.q,
                  fields: ['shortName^70', 'name^50', 'nameKZ^40', '_all'],
                  type: 'phrase', // or keyword
                  slop: 100,
                  boost: 10,
                },
              },
              {
                multi_match: {
                  query: filter.q,
                  fields: ['name^50', '_all'],
                  operator: 'and',
                },
              },
            ],
          },
        },
      },
    });
  }

  if (must.length > 0) {
    return { bool: { must } };
  }
  return null;
}

GovStatBinEsTC.wrapResolver('searchConnection', resolver => {
  resolver.addArgs({
    filter: 'JSON',
    withAggs: 'Boolean',
  });

  return resolver.wrapResolve(next => rp => {
    if (rp.args) {
      if (rp.args.filter) {
        rp.args.query = getQuery(rp.args.filter);
        delete rp.args.filter;
      }
    }
    return next(rp);
  });
});
