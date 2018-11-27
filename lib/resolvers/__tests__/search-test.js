"use strict";

var _graphqlCompose = require("graphql-compose");

var Search = _interopRequireWildcard(require("../search"));

var _elasticClient = _interopRequireDefault(require("../../__mocks__/elasticClient"));

var _cv = require("../../__mocks__/cv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

describe('search resolver', () => {
  it('should return Resolver', () => {
    expect((0, Search.default)(_cv.CvFieldMap, _cv.CvTC, _elasticClient.default)).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.resolve', () => {
    const SearchResolver = (0, Search.default)(_cv.CvFieldMap, _cv.CvTC, _elasticClient.default);
    it.skip('should return result', () => {
      return SearchResolver.resolve({}).then(res => {
        console.log(res); // eslint-disable-line
      });
    });
  });
  describe('helper methods', () => {
    it('toDottedList()', () => {
      expect(Search.toDottedList({
        a: {
          b: true,
          c: {
            e: true
          }
        },
        d: true
      })).toEqual(['a.b', 'a.c.e', 'd']);
      expect(Search.toDottedList({})).toEqual(true);
    });
  });
});