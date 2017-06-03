/* @flow */
/* eslint-disable no-unused-vars */

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType, desc } from '../../utils';

export function getIpRangeTypeITC(opts: mixed = {}): mixed {
  const name = getTypeName('IpRangeType', opts);
  const description = desc(`Ip range where \`from\` value includes and \`to\` value excludes.`);

  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: {
        from: 'String',
        to: 'String',
        mask: {
          type: 'String',
          description: 'IP ranges can also be defined as CIDR masks 10.0.0.127/25',
        },
      },
    })
  );
}
