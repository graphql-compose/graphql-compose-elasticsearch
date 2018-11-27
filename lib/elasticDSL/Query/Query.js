"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryITC = getQueryITC;
exports.prepareQueryInResolve = prepareQueryInResolve;
exports.renameUndescoredToDots = renameUndescoredToDots;

var _graphqlCompose = require("graphql-compose");

var _MatchAll = require("./MatchAll");

var _Bool = require("./Compound/Bool");

var _ConstantScore = require("./Compound/ConstantScore");

var _DisMax = require("./Compound/DisMax");

var _Boosting = require("./Compound/Boosting");

var _FunctionScore = require("./Compound/FunctionScore");

var _Exists = require("./TermLevel/Exists");

var _Fuzzy = require("./TermLevel/Fuzzy");

var _Ids = require("./TermLevel/Ids");

var _Prefix = require("./TermLevel/Prefix");

var _Range = require("./TermLevel/Range");

var _Regexp = require("./TermLevel/Regexp");

var _Type = require("./TermLevel/Type");

var _Term = require("./TermLevel/Term");

var _Terms = require("./TermLevel/Terms");

var _Wildcard = require("./TermLevel/Wildcard");

var _Match = require("./FullText/Match");

var _MatchPhrase = require("./FullText/MatchPhrase");

var _MatchPhrasePrefix = require("./FullText/MatchPhrasePrefix");

var _MultiMatch = require("./FullText/MultiMatch");

var _Common = require("./FullText/Common");

var _QueryString = require("./FullText/QueryString");

var _SimpleQueryString = require("./FullText/SimpleQueryString");

var _GeoBoundingBox = require("./Geo/GeoBoundingBox");

var _GeoDistance = require("./Geo/GeoDistance");

var _GeoPolygon = require("./Geo/GeoPolygon");

var _GeoShape = require("./Geo/GeoShape");

var _MoreLikeThis = require("./Specialized/MoreLikeThis");

var _Percolate = require("./Specialized/Percolate");

var _Script = require("./Specialized/Script");

var _HasChild = require("./Joining/HasChild");

var _HasParent = require("./Joining/HasParent");

var _Nested = require("./Joining/Nested");

var _ParentId = require("./Joining/ParentId");

var _utils = require("../../utils");

function getQueryITC(opts = {}) {
  const name = (0, _utils.getTypeName)('Query', opts);
  const description = (0, _utils.desc)(`
    Elasticsearch provides a full Query DSL based on JSON to define queries.
    [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
  `);
  return (0, _utils.getOrSetType)(name, () => _graphqlCompose.InputTypeComposer.create({
    name,
    description,
    fields: {
      match_all: () => (0, _MatchAll.getMatchAllITC)(opts),
      // Compound quries
      bool: () => (0, _Bool.getBoolITC)(opts),
      constant_score: () => (0, _ConstantScore.getConstantScoreITC)(opts),
      dis_max: () => (0, _DisMax.getDisMaxITC)(opts),
      boosting: () => (0, _Boosting.getBoostingITC)(opts),
      function_score: () => (0, _FunctionScore.getFunctionScoreITC)(opts),
      // FullText queries
      match: () => (0, _Match.getMatchITC)(opts),
      match_phrase: () => (0, _MatchPhrase.getMatchPhraseITC)(opts),
      match_phrase_prefix: () => (0, _MatchPhrasePrefix.getMatchPhrasePrefixITC)(opts),
      multi_match: () => (0, _MultiMatch.getMultiMatchITC)(opts),
      common: () => (0, _Common.getCommonITC)(opts),
      query_string: () => (0, _QueryString.getQueryStringITC)(opts),
      simple_query_string: () => (0, _SimpleQueryString.getSimpleQueryStringITC)(opts),
      // Term queries
      exists: () => (0, _Exists.getExistsITC)(opts),
      fuzzy: () => (0, _Fuzzy.getFuzzyITC)(opts),
      ids: () => (0, _Ids.getIdsITC)(opts),
      prefix: () => (0, _Prefix.getPrefixITC)(opts),
      range: () => (0, _Range.getRangeITC)(opts),
      regexp: () => (0, _Regexp.getRegexpITC)(opts),
      type: () => (0, _Type.getTypeITC)(opts),
      term: () => (0, _Term.getTermITC)(opts),
      terms: () => (0, _Terms.getTermsITC)(opts),
      wildcard: () => (0, _Wildcard.getWildcardITC)(opts),
      // Geo queries
      geo_bounding_box: () => (0, _GeoBoundingBox.getGeoBoundingBoxITC)(opts),
      geo_distance: () => (0, _GeoDistance.getGeoDistanceITC)(opts),
      geo_polygon: () => (0, _GeoPolygon.getGeoPolygonITC)(opts),
      geo_shape: () => (0, _GeoShape.getGeoShapeITC)(opts),
      // Specialized queries
      more_like_this: () => (0, _MoreLikeThis.getMoreLikeThisITC)(opts),
      percolate: () => (0, _Percolate.getPercolateITC)(opts),
      script: () => (0, _Script.getScriptITC)(opts),
      // Joining queries
      has_child: () => (0, _HasChild.getHasChildITC)(opts),
      has_parent: () => (0, _HasParent.getHasParentITC)(opts),
      nested: () => (0, _Nested.getNestedITC)(opts),
      parent_id: () => (0, _ParentId.getParentIdITC)(opts)
    }
  }));
}
/* eslint-disable no-param-reassign */


function prepareQueryInResolve(query, fieldMap) {
  //
  // Compound quries
  //
  if (query.bool) {
    query.bool = (0, _Bool.prepareBoolInResolve)(query.bool, fieldMap);
  }

  if (query.constant_score) {
    query.constant_score = (0, _ConstantScore.prepareConstantScoreInResolve)(query.constant_score, fieldMap);
  }

  if (query.dis_max) {
    query.dis_max = (0, _DisMax.prepareDisMaxResolve)(query.dis_max, fieldMap);
  }

  if (query.boosting) {
    query.boosting = (0, _Boosting.prepareBoostingInResolve)(query.boosting, fieldMap);
  }

  if (query.function_score) {
    query.function_score = (0, _FunctionScore.prepareFunctionScoreInResolve)(query.function_score, fieldMap);
  } //
  // FullText queries
  //


  if (query.match) {
    query.match = renameUndescoredToDots(query.match, fieldMap);
  }

  if (query.match_phrase) {
    query.match_phrase = renameUndescoredToDots(query.match_phrase, fieldMap);
  }

  if (query.match_phrase_prefix) {
    query.match_phrase_prefix = renameUndescoredToDots(query.match_phrase_prefix, fieldMap);
  }

  if (query.common) {
    query.common = renameUndescoredToDots(query.common, fieldMap);
  } //
  // Geo queries
  //


  if (query.geo_bounding_box) {
    query.geo_bounding_box = renameUndescoredToDots(query.geo_bounding_box, fieldMap);
  }

  if (query.geo_distance) {
    query.geo_distance = renameUndescoredToDots(query.geo_distance, fieldMap);
  }

  if (query.geo_polygon) {
    query.geo_polygon = renameUndescoredToDots(query.geo_polygon, fieldMap);
  }

  if (query.geo_shape) {
    query.geo_shape = renameUndescoredToDots(query.geo_shape, fieldMap);
  } //
  // TermLevel queries
  //


  if (query.fuzzy) {
    query.fuzzy = renameUndescoredToDots(query.fuzzy, fieldMap);
  }

  if (query.prefix) {
    query.prefix = renameUndescoredToDots(query.prefix, fieldMap);
  }

  if (query.range) {
    query.range = renameUndescoredToDots(query.range, fieldMap);
  }

  if (query.regexp) {
    query.regexp = renameUndescoredToDots(query.regexp, fieldMap);
  }

  if (query.term) {
    query.term = renameUndescoredToDots(query.term, fieldMap);
  }

  if (query.terms) {
    query.terms = renameUndescoredToDots(query.terms, fieldMap);
  }

  if (query.wildcard) {
    query.wildcard = renameUndescoredToDots(query.wildcard, fieldMap);
  }

  return query;
}
/* eslint-disable no-unused-vars */


function renameUndescoredToDots(obj, fieldMap) {
  const result = {};
  Object.keys(obj).forEach(o => {
    result[o.replace(/__/g, '.')] = obj[o];
  });
  return result;
}