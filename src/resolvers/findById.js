/* @flow */

import { Resolver, TypeComposer } from 'graphql-compose';
import type { ResolveParams } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getFindByIdOutputTC } from '../types/FindByIdOutput';

export type ElasticResolverOpts = {
  prefix?: ?string,
  elasticIndex: string,
  elasticType: string,
  elasticClient: Object,
};

export default function createFindByIdResolver(
  fieldMap: FieldsMapByElasticType,
  sourceTC: TypeComposer,
  opts: ElasticResolverOpts
): Resolver {
  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'First arg for Resolver findById() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver findById() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix,
  });

  const findByIdFC = parser.generateFieldConfig('get', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  const argsConfigMap = Object.assign({}, findByIdFC.args);

  const topLevelArgs = ['id'];

  Object.keys(argsConfigMap).forEach(argKey => {
    if (topLevelArgs.indexOf(argKey) === -1) {
      delete argsConfigMap[argKey];
    }
  });

  const type = getFindByIdOutputTC({ prefix, fieldMap, sourceTC });

  return new Resolver({
    type,
    name: 'findById',
    kind: 'query',
    args: argsConfigMap,
    resolve: async (rp: ResolveParams<*, *>) => {
      const { source, args, context, info } = rp;

      if (!args.id) {
        throw new Error(`Missed 'id' argument!`);
      }

      const res = await findByIdFC.resolve(source, args, context, info);
      const { _index, _type, _id, _version, _source } = res || {};

      return {
        _index,
        _type,
        _id,
        _version,
        ..._source,
      };
    },
  });
}
