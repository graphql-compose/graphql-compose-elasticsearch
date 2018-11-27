"use strict";

var _graphqlCompose = require("graphql-compose");

var _findById = _interopRequireDefault(require("../findById"));

var _elasticClient = _interopRequireDefault(require("../../__mocks__/elasticClient"));

var _cv = require("../../__mocks__/cv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const findByIdResolver = (0, _findById.default)(_cv.CvFieldMap, _cv.CvTC, {
  elasticClient: _elasticClient.default,
  elasticIndex: 'cv',
  elasticType: 'cv'
});
describe('findById', () => {
  it('return instance of Resolver', () => {
    expect(findByIdResolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  it('check args', () => {
    expect(findByIdResolver.hasArg('id')).toBeTruthy();
  });
  it('resolve', () => {
    findByIdResolver.resolve({
      args: {
        id: '4554'
      },
      context: {
        elasticClient: _elasticClient.default
      }
    }).then(res => {
      console.log(res); // eslint-disable-line
    });
  });
});