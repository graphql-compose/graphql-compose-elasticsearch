import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';
import { getFloatRangeKeyedITC } from '../../Commons/Float';
import { getCommonsScriptITC } from '../../Commons/Script';
import { getNumericFields } from '../../Commons/FieldNames';

export function getRangeITC<TContext>(opts: CommonOpts<TContext>): InputTypeComposer<TContext> {
  const name = getTypeName('AggsRange', opts);
  const description = desc(
    `
    A multi-bucket value source based aggregation that enables the user
    to define a set of ranges - each representing a bucket.
    Note that this aggregation includes the \`from\` value and excludes the
    \`to\` value for each range.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-range-aggregation.html)
  `
  );

  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      field: getNumericFields(opts),
      ranges: (): InputTypeComposer<TContext>[] => [getFloatRangeKeyedITC(opts)],
      keyed: 'Boolean',
      script: (): InputTypeComposer<TContext> => getCommonsScriptITC(opts),
    },
  }));
}
