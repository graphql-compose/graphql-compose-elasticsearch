/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getCommonsHdrITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('CommonsHDR', opts);
  const description = desc(
    `
    A High Dynamic Range (HDR) Histogram.
    [Documentation](https://github.com/HdrHistogram/HdrHistogram)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        number_of_significant_value_digits: 'Int',
      },
    }));
}
