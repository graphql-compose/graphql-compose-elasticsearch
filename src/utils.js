/* @flow */

import typeStorage from './typeStorage';

export function getTypeName(name: string, opts: any): string {
  return `${(opts && opts.prefix) || 'Elastic'}${name}${(opts && opts.postfix) || ''}`;
}

export function getOrSetType<T>(typeName: string, typeOrThunk: (() => T) | T): T {
  const type: any = typeStorage.getOrSet(typeName, typeOrThunk);
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
