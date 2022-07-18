import type { InputTypeComposer } from 'graphql-compose';
import { getAggBlockITC } from './AggBlock';
import { CommonOpts } from '../../utils';

export function getAggsITC<TContext>(
  opts: CommonOpts<TContext>
): Array<InputTypeComposer<TContext>> {
  return [getAggBlockITC(opts)];
}

export type ElasticAggsT = {
  [outputFieldName: string]: ElasticAggsRulesT;
};

export type ElasticAggsRulesT = {
  [aggOperationName: string]: any;
  aggs?: ElasticAggsT;
};

export type GqlAggBlock = {
  key: string;
  value: GqlAggRules;
};

export type GqlAggRules = {
  [aggOperationName: string]: any;
  aggs?: GqlAggBlock[];
};

export function prepareAggsInResolve(
  aggs: GqlAggBlock[],
  _fieldMap: any
): { [argName: string]: any } {
  if (Array.isArray(aggs)) {
    return convertAggsBlocks(aggs);
  }
  return aggs;
}

export function convertAggsBlocks(blockList: GqlAggBlock[]): ElasticAggsT {
  const result = {} as ElasticAggsT;
  blockList.forEach((block) => {
    if (block.key && block.value) {
      result[block.key] = convertAggsRules(block.value);
    }
  });
  return result;
}

export function convertAggsRules(rules: GqlAggRules): ElasticAggsRulesT {
  const result = {} as ElasticAggsRulesT;
  Object.keys(rules).forEach((key) => {
    if (key === 'aggs' && rules.aggs) {
      result.aggs = convertAggsBlocks(rules.aggs);
    } else if (Array.isArray(rules[key])) {
      result[key.replace(/__/g, '.')] = rules[key].map((rule: any) => convertAggsRules(rule));
    } else if (typeof rules[key] === 'object') {
      result[key.replace(/__/g, '.')] = convertAggsRules(rules[key]);
    } else {
      result[key.replace(/__/g, '.')] = rules[key];
    }
  });
  return result;
}
