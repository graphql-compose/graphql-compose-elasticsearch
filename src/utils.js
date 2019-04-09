/* @flow */

import type {
  SchemaComposer,
  ObjectTypeComposer,
  InputTypeComposer,
  EnumTypeComposer,
  ComposeInputObjectTypeConfig,
  ComposeEnumTypeConfig,
  ObjectTypeComposeDefinition,
} from 'graphql-compose';
import { isFunction } from 'graphql-compose';
import type { ElasticMappingT, FieldsMapByElasticType } from './mappingConverter';

export type CommonOpts<TContext = {}> = {
  prefix?: string,
  postfix?: string,
  pluralFields?: string[],
  elasticIndex: string,
  elasticType: string,
  elasticClient: Object,
  fieldMap: FieldsMapByElasticType,
  sourceTC: ObjectTypeComposer<any, TContext>,
  schemaComposer: SchemaComposer<TContext>,
  getOrCreateOTC: (
    name: string,
    () => ObjectTypeComposeDefinition<any, TContext>
  ) => ObjectTypeComposer<any, TContext>,
  getOrCreateITC: (name: string, () => ComposeInputObjectTypeConfig) => InputTypeComposer<TContext>,
  getOrCreateETC: (name: string, () => ComposeEnumTypeConfig) => EnumTypeComposer<TContext>,
};

export function prepareCommonOpts<TContext>(
  schemaComposer: SchemaComposer<TContext>,
  opts: mixed = {}
): CommonOpts<TContext> {
  return {
    schemaComposer,
    getOrCreateOTC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createObjectTC(
          isFunction(cfgOrThunk) ? (cfgOrThunk: any)() : cfgOrThunk
        );
        return tc;
      });
    },
    getOrCreateITC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createInputTC(
          isFunction(cfgOrThunk) ? (cfgOrThunk: any)() : cfgOrThunk
        );
        return tc;
      });
    },
    getOrCreateETC: (typeName, cfgOrThunk) => {
      return schemaComposer.getOrSet(typeName, () => {
        const tc = schemaComposer.createEnumTC(
          isFunction(cfgOrThunk) ? (cfgOrThunk: any)() : cfgOrThunk
        );
        return tc;
      });
    },
    ...opts,
  };
}

export function getTypeName(name: string, opts: any): string {
  return `${(opts && opts.prefix) || 'Elastic'}${name}${(opts && opts.postfix) || ''}`;
}

// Remove newline multiline in descriptions
export function desc(str: string): string {
  return str.replace(/\n\s+/gi, ' ').replace(/^\s+/, '');
}

export function reorderKeys<T: Object>(obj: T, names: string[]): T {
  const orderedFields = {};
  const fields = { ...obj };
  names.forEach(name => {
    if (fields[name]) {
      orderedFields[name] = fields[name];
      delete fields[name];
    }
  });
  return { ...orderedFields, ...fields };
}

export type fetchElasticMappingOptsT = {
  elasticIndex: string,
  elasticType: string,
  elasticMapping: ElasticMappingT,
  elasticClient: Object,
};

export async function fetchElasticMapping(
  opts: fetchElasticMappingOptsT
): Promise<ElasticMappingT> {
  if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
    throw new Error('Must provide `elasticIndex` string parameter from your Elastic server.');
  }

  if (!opts.elasticType || typeof opts.elasticType !== 'string') {
    throw new Error('Must provide `elasticType` string parameter from your Elastic server.');
  }

  if (!opts.elasticClient) {
    throw new Error(
      'Must provide `elasticClient` Object parameter connected to your Elastic server.'
    );
  }

  const elasticMapping = (await opts.elasticClient.indices.getMapping({
    index: opts.elasticIndex,
    type: opts.elasticType,
  }))[opts.elasticIndex].mappings[opts.elasticType];

  return elasticMapping;
}
