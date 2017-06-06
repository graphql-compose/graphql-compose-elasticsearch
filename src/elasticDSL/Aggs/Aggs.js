/* @flow */

import { getAggBlockITC } from './AggBlock';

export function getAggsITC(opts: mixed) {
  return [getAggBlockITC(opts)];
}

export type ElasticAggsT = {
  [outputFieldName: string]: ElasticAggsRulesT,
};

export type ElasticAggsRulesT = {
  [aggOperationName: string]: mixed,
  aggs?: ElasticAggsT,
};

export type GqlAggBlock = {
  key: string,
  value: GqlAggRules,
};

export type GqlAggRules = {
  [aggOperationName: string]: mixed,
  aggs?: GqlAggBlock[],
};

export function prepareAggsInResolve(
  aggs: GqlAggBlock[],
  fieldMap: any // eslint-disable-line
): { [argName: string]: any } {
  if (Array.isArray(aggs)) {
    return convertAggsBlocks(aggs);
  }
  return aggs;
}

export function convertAggsBlocks(blockList: GqlAggBlock[]): ElasticAggsT {
  const result = {};
  blockList.forEach(block => {
    if (block.key && block.value) {
      result[block.key] = convertAggsRules(block.value);
    }
  });
  return result;
}

export function convertAggsRules(rules: GqlAggRules): ElasticAggsRulesT {
  const result = {};
  Object.keys(rules).forEach(key => {
    if (key === 'aggs' && rules.aggs) {
      result.aggs = convertAggsBlocks(rules.aggs);
    } else {
      // $FlowFixMe
      result[key] = rules[key];
    }
  });
  return result;
}
