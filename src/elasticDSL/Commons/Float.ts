/* eslint-disable no-unused-vars */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../utils';

export function getFloatRangeITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('FloatRange', opts);
  const description = desc(`Float range where \`from\` value includes and \`to\` value excludes.`);

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      from: 'Float',
      to: 'Float',
    },
  }));
}

export function getFloatRangeKeyedITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('FloatRangeKeyed', opts);
  const description = desc(
    `
    Float range where \`from\` value includes and \`to\` value excludes and
    may have a key for aggregation.
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      from: 'Float',
      to: 'Float',
      key: 'String',
    },
  }));
}
