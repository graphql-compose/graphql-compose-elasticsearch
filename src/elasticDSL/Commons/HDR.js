/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, type CommonOpts, desc } from '../../utils';

export function getCommonsHdrITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> {
  const name = getTypeName('CommonsHDR', opts);
  const description = desc(
    `
    A High Dynamic Range (HDR) Histogram.
    [Documentation](https://github.com/HdrHistogram/HdrHistogram)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      number_of_significant_value_digits: 'Int',
    },
  }));
}
