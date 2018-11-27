"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CvTC = exports.CvFieldMap = void 0;

var _mappingConverter = require("../mappingConverter");

var _cvMapping = _interopRequireDefault(require("./cvMapping"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CvFieldMap = (0, _mappingConverter.inputPropertiesToGraphQLTypes)(_cvMapping.default);
exports.CvFieldMap = CvFieldMap;
const CvTC = (0, _mappingConverter.convertToSourceTC)(_cvMapping.default, 'Cv');
exports.CvTC = CvTC;