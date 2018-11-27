"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSortITC = getSortITC;

var _graphqlCompose = require("graphql-compose");

var _utils = require("../utils");

var _FieldNames = require("./Commons/FieldNames");

const sortableTypes = ['byte', 'short', 'integer', 'long', 'double', 'float', 'half_float', 'scaled_float', 'token_count', 'date', 'boolean', 'ip', 'keyword'];

function getSortITC(opts = {}) {
  const name = (0, _utils.getTypeName)('SortEnum', opts);
  const description = 'Sortable fields from mapping';

  if (!opts.fieldMap) {
    return 'JSON';
  }

  return (0, _utils.getOrSetType)(name, () => {
    const sortableFields = (0, _FieldNames.getFieldNamesByElasticType)(opts.fieldMap, sortableTypes);

    if (sortableFields.length === 0) {
      return 'JSON';
    }

    const values = {
      _score: {
        value: '_score'
      }
    };
    sortableFields.forEach(fieldName => {
      const dottedName = fieldName.replace(/__/g, '.');
      values[`${fieldName}__asc`] = {
        value: {
          [dottedName]: 'asc'
        }
      };
      values[`${fieldName}__desc`] = {
        value: {
          [dottedName]: 'desc'
        }
      };
    });
    return _graphqlCompose.EnumTypeComposer.create({
      name,
      description,
      values
    });
  });
}