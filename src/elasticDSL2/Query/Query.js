/* @flow */

import { InputTypeComposer } from 'graphql-compose';
import { getMatchAllITC } from './MatchAll';

import { getBoolITC } from './Compound/Bool';
import { getConstantScoreITC } from './Compound/ConstantScore';
import { getDisMaxITC } from './Compound/DisMax';
import { getBoostingITC } from './Compound/Boosting';
import { getFunctionScoreITC } from './Compound/FunctionScore';

import { getExistsITC } from './TermLevel/Exists';
import { getFuzzyITC } from './TermLevel/Fuzzy';
import { getIdsITC } from './TermLevel/Ids';
import { getPrefixITC } from './TermLevel/Prefix';
import { getRangeITC } from './TermLevel/Range';
import { getRegexpITC } from './TermLevel/Regexp';
import { getTypeITC } from './TermLevel/Type';
import { getTermITC } from './TermLevel/Term';
import { getTermsITC } from './TermLevel/Terms';
import { getWildcardITC } from './TermLevel/Wildcard';

import { getMatchITC } from './FullText/Match';
import { getMatchPhraseITC } from './FullText/MatchPhrase';
import { getMatchPhrasePrefixITC } from './FullText/MatchPhrasePrefix';
import { getMultiMatchITC } from './FullText/MultiMatch';
import { getCommonITC } from './FullText/Common';
import { getQueryStringITC } from './FullText/QueryString';
import { getSimpleQueryStringITC } from './FullText/SimpleQueryString';

import { getGeoBoundingBoxITC } from './Geo/GeoBoundingBox';
import { getGeoDistanceITC } from './Geo/GeoDistance';
import { getGeoPolygonITC } from './Geo/GeoPolygon';
import { getGeoShapeITC } from './Geo/GeoShape';

import { getMoreLikeThisITC } from './Specialized/MoreLikeThis';
import { getPercolateITC } from './Specialized/Percolate';
import { getScriptITC } from './Specialized/Script';

import { getHasChildITC } from './Joining/HasChild';
import { getHasParentITC } from './Joining/HasParent';
import { getNestedITC } from './Joining/Nested';
import { getParentIdITC } from './Joining/ParentId';

import { getTypeName, getOrSetType, desc } from '../../utils';

export function getQueryITC(opts: mixed = {}): InputTypeComposer {
  const name = getTypeName('Query', opts);
  const description = desc(
    `
    Elasticsearch provides a full Query DSL based on JSON to define queries.
    [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
  `
  );

  return getOrSetType(name, () =>
    // $FlowFixMe
    InputTypeComposer.create({
      name,
      description,
      fields: {
        match_all: () => getMatchAllITC(opts),

        // Compound quries
        bool: () => getBoolITC(opts),
        constant_score: () => getConstantScoreITC(opts),
        dis_max: () => getDisMaxITC(opts),
        boosting: () => getBoostingITC(opts),
        function_score: () => getFunctionScoreITC(opts),

        // FullText queries
        match: () => getMatchITC(opts),
        match_phrase: () => getMatchPhraseITC(opts),
        match_phrase_prefix: () => getMatchPhrasePrefixITC(opts),
        multi_match: () => getMultiMatchITC(opts),
        common: () => getCommonITC(opts),
        query_string: () => getQueryStringITC(opts),
        simple_query_string: () => getSimpleQueryStringITC(opts),

        // Term queries
        exists: () => getExistsITC(opts),
        fuzzy: () => getFuzzyITC(opts),
        ids: () => getIdsITC(opts),
        prefix: () => getPrefixITC(opts),
        range: () => getRangeITC(opts),
        regexp: () => getRegexpITC(opts),
        type: () => getTypeITC(opts),
        term: () => getTermITC(opts),
        terms: () => getTermsITC(opts),
        wildcard: () => getWildcardITC(opts),

        // Geo queries
        geo_bounding_box: () => getGeoBoundingBoxITC(opts),
        geo_distance: () => getGeoDistanceITC(opts),
        geo_polygon: () => getGeoPolygonITC(opts),
        geo_shape: () => getGeoShapeITC(opts),

        // Specialized queries
        more_like_this: () => getMoreLikeThisITC(opts),
        percolate: () => getPercolateITC(opts),
        script: () => getScriptITC(opts),

        // Joining queries
        has_child: () => getHasChildITC(opts),
        has_parent: () => getHasParentITC(opts),
        nested: () => getNestedITC(opts),
        parent_id: () => getParentIdITC(opts),
      },
    }));
}
