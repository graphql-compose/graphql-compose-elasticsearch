"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggsITC = getAggsITC;
exports.prepareAggsInResolve = prepareAggsInResolve;
exports.convertAggsBlocks = convertAggsBlocks;
exports.convertAggsRules = convertAggsRules;

var _AggBlock = require("./AggBlock");

function getAggsITC(opts) {
  return [(0, _AggBlock.getAggBlockITC)(opts)];
}

function prepareAggsInResolve(aggs, fieldMap // eslint-disable-line
) {
  if (Array.isArray(aggs)) {
    return convertAggsBlocks(aggs);
  }

  return aggs;
}

function convertAggsBlocks(blockList) {
  const result = {};
  blockList.forEach(block => {
    if (block.key && block.value) {
      result[block.key] = convertAggsRules(block.value);
    }
  });
  return result;
}

function convertAggsRules(rules) {
  const result = {};
  Object.keys(rules).forEach(key => {
    if (key === 'aggs' && rules.aggs) {
      result.aggs = convertAggsBlocks(rules.aggs);
    } else {
      result[key] = rules[key];
    }
  });
  return result;
}