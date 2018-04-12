/* @flow */

import { Resolver, TypeComposer, InputTypeComposer, type ResolveParams } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getUpdateByIdOutputTC } from '../types/UpdateByIdOutput';
import { getTypeName, getOrSetType, desc } from '../utils';

export type ElasticResolverOpts = {
  prefix?: ?string,
  elasticIndex: string,
  elasticType: string,
  elasticClient: Object,
};

export default function createUpdateByIdResolver(
  fieldMap: FieldsMapByElasticType,
  sourceTC: TypeComposer,
  opts: ElasticResolverOpts
): Resolver {
  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'First arg for Resolver updateById() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver updateById() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix,
  });

  const updateByIdFC = parser.generateFieldConfig('update', {
    index: opts.elasticIndex,
    type: opts.elasticType,
    _source: true,
  });

  const argsConfigMap = {
    id: 'String!',
    record: getRecordITC(fieldMap).getTypeAsRequired(),
  };

  const type = getUpdateByIdOutputTC({ prefix, fieldMap, sourceTC });

  return new Resolver({
    type,
    name: 'updateById',
    kind: 'mutation',
    args: argsConfigMap,
    resolve: async (rp: ResolveParams<*, *>) => {
      const { source, args, context, info } = rp;

      args.body = {
        doc: {
          ...args.record,
        },
      };
      delete args.record;

      const res = await updateByIdFC.resolve(source, args, context, info);

      const { _index, _type, _id, _version, result, get } = res || {};
      const { _source } = get || {};

      return {
        _id,
        _index,
        _type,
        _version,
        result,
        ..._source,
      };
    },
  });
}

export function getRecordITC(fieldMap: FieldsMapByElasticType): InputTypeComposer {
  const name = getTypeName('Record', {});
  const description = desc(`The record from Elastic Search`);
  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: { ...fieldMap._all },
    })
  );
}
