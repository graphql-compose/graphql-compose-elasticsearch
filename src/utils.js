import typeStorage from './typeStorage';

export function getTypeName(name: string, opts: any): string {
  return `${opts && opts.prefix || 'Elastic'}${name}${opts && opts.postfix || ''}`;
}

export function getOrSetType<T>(typeName: string, typeOrThunk: T | () => T): T {
  return typeStorage.getOrSet(typeName, typeOrThunk);
}
