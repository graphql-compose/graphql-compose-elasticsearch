/* @flow */

import { Resolver, InputTypeComposer, type ResolverResolveParams } from 'graphql-compose';
import ElasticApiParser from '../ElasticApiParser';
import { getUpdateByIdOutputTC } from '../types/UpdateByIdOutput';
import { getTypeName, type CommonOpts, desc } from '../utils';

export default function createUpdateByIdResolver<TSource, TContext>(
  opts: CommonOpts<TContext>
): Resolver<TSource, TContext> {
  const { fieldMap, sourceTC, schemaComposer } = opts;

  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'opts.fieldMap for Resolver updateById() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!sourceTC || sourceTC.constructor.name !== 'ObjectTypeComposer') {
    throw new Error(
      'opts.sourceTC for Resolver updateById() should be instance of ObjectTypeComposer.'
    );
  }

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix: opts.prefix,
  });

  const updateByIdFC = parser.generateFieldConfig('update', {
    index: opts.elasticIndex,
    type: opts.elasticType,
    _source: true,
  });

  const argsConfigMap = {
    id: 'String!',
    record: getRecordITC(opts).getTypeNonNull(),
  };

  const type = getUpdateByIdOutputTC(opts);

  return schemaComposer.createResolver({
    type,
    name: 'updateById',
    kind: 'mutation',
    args: argsConfigMap,
    resolve: async (rp: ResolverResolveParams<*, *>) => {
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

export function getRecordITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('Record', {});
  const description = desc(`The record from Elastic Search`);
  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: { ...opts.fieldMap._all },
  }));
}
