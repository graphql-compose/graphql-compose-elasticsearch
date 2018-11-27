"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _elasticsearch = _interopRequireDefault(require("elasticsearch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const elasticClient = new _elasticsearch.default.Client({
  host: 'http://localhost:9200',
  apiVersion: '5.0' // log: 'trace',

});
var _default = elasticClient;
exports.default = _default;