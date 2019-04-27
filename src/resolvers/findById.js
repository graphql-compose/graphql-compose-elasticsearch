/* @flow */

import { Resolver } from 'graphql-compose';
import type { ResolverResolveParams } from 'graphql-compose';
import ElasticApiParser from '../ElasticApiParser';
import { getFindByIdOutputTC } from '../types/FindByIdOutput';
import type { CommonOpts } from '../utils';

export default function createFindByIdResolver<TSource, TContext>(
  opts: CommonOpts<TContext>
): Resolver<TSource, TContext> {
  const { fieldMap, sourceTC, schemaComposer } = opts;

  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'opts.fieldMap for Resolver findById() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!sourceTC || sourceTC.constructor.name !== 'ObjectTypeComposer') {
    throw new Error(
      'opts.sourceTC for Resolver findById() should be instance of ObjectTypeComposer.'
    );
  }

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix: opts.prefix,
  });

  const findByIdFC = parser.generateFieldConfig('get', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  const type = getFindByIdOutputTC(opts);

  return schemaComposer.createResolver({
    type,
    name: 'findById',
    kind: 'query',
    args: {
      id: 'String!',
    },
    resolve: async (rp: ResolverResolveParams<*, *>) => {
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
