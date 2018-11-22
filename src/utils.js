/* @flow */

import { TypeStorage } from 'graphql-compose';

const typeStorage = new TypeStorage();

export function getTypeName(name: string, opts: any): string {
  return `${(opts && opts.prefix) || 'Elastic'}${name}${(opts && opts.postfix) || ''}`;
}

export function getOrSetType<T>(typeName: string, typeOrThunk: (() => T) | T): T {
  const type: any = typeStorage.getOrSet(typeName, (typeOrThunk: any));
  return type;
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
  elasticClient: Object
};

export async function fetchElasticMapping(opts: fetchElasticMappingOptsT): ElasticMappingT {
  if (!opts.elasticIndex || typeof opts.elasticIndex !== 'string') {
    throw new Error(
      'Must provide `elasticIndex` string parameter from your Elastic server.'
    );
  }

  if (!opts.elasticType || typeof opts.elasticType !== 'string') {
    throw new Error(
      'Must provide `elasticType` string parameter from your Elastic server.'
    );
  }

  if (!opts.elasticClient) {
    throw new Error(
      'Must provide `elasticClient` Object parameter connected to your Elastic server.'
    );
  }

  const elasticMapping = (await opts.elasticClient.indices.getMapping({
    index: opts.elasticIndex,
    type: opts.elasticType
  }))[opts.elasticIndex].mappings[opts.elasticType];

  return elasticMapping;
};