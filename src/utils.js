/* @flow */

import typeStorage from './typeStorage';

export function getTypeName(name: string, opts: any): string {
  return `${(opts && opts.prefix) || 'Elastic'}${name}${(opts && opts.postfix) || ''}`;
}

export function getOrSetType<T>(
  typeName: string,
  typeOrThunk: (() => T) | T
): T {
  // $FlowFixMe
  const type: T = typeStorage.getOrSet(typeName, typeOrThunk);
  return type;
}

// Remove newline multiline in descriptions
export function desc(str: string): string {
  return str.replace(/\n\s+/ig, ' ').replace(/^\s+/, '');
}
