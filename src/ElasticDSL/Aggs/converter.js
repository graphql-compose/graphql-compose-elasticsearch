import type { GraphQLFieldResolver } from 'graphql/type/definition';

export type ElasticAggsT = {
  [outputFieldName: string]: ElasticAggsRulesT,
};

export type ElasticAggsRulesT = {
  [aggOperationName: string]: mixed,
  aggs: ElasticAggsT,
};

export type GqlAggBlock = {
  key: string,
  value: GqlAggRules,
};

export type GqlAggRules = {
  [aggOperationName: string]: mixed,
  aggs: GqlAggBlock,
};

export default function argsBlockConverter(
  resolve: GraphQLFieldResolver<*, *>
): GraphQLFieldResolver<*, *> {
  return (source, args, context, info) => {
    if (args.body && Array.isArray(args.body.aggs)) {
      const aggs: GqlAggBlock[] = args.body.aggs;
      args.body.aggs = convertAggsBlocks(aggs); // eslint-disable-line
    }

    return resolve(source, args, context, info);
  };
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
      result[key] = rules[key];
    }
  });
  return result;
}
