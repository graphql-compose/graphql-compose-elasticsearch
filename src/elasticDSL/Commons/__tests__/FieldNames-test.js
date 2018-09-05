/* @flow */

import { EnumTypeComposer } from 'graphql-compose';
import * as FieldNames from '../FieldNames';

const fieldMap = {
  _all: {
    text1: {},
    text2: {},
    keyword1: {},
    int1: {},
    float1: {},
    double1: {},
    date1: {},
    boolean1: {},
    geo1: {},
    nested1: {},
    ip1: {},
  },
  text: {
    text1: {},
    text2: {},
  },
  keyword: {
    keyword1: {},
  },
  integer: {
    int1: {},
  },
  float: {
    float1: {},
  },
  double: {
    double1: {},
  },
  date: {
    date1: {},
  },
  boolean: {
    boolean1: {},
  },
  geo_point: {
    geo1: {},
  },
  nested: {
    nested1: {},
  },
  ip: {
    ip1: {},
  },
};
const opts = { fieldMap };

describe('FieldNames', () => {
  it('getStringFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getStringFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticStringFields');
    expect(type.getFields()).toMatchObject({
      keyword1: { value: 'keyword1' },
      text1: { value: 'text1' },
      text2: { value: 'text2' },
    });
  });

  it('getNumericFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getNumericFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticNumericFields');
    expect(type.getFields()).toMatchObject({
      double1: { value: 'double1' },
      float1: { value: 'float1' },
      int1: { value: 'int1' },
    });
  });

  it('getDateFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getDateFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticDateFields');
    expect(type.getFields()).toMatchObject({
      date1: { value: 'date1' },
    });
  });

  it('getBooleanFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getBooleanFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticBooleanFields');
    expect(type.getFields()).toMatchObject({
      boolean1: { value: 'boolean1' },
    });
  });

  it('getGeoPointFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getGeoPointFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticGeoPointFields');
    expect(type.getFields()).toMatchObject({
      geo1: { value: 'geo1' },
    });
  });

  it('getNestedFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getNestedFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticNestedFields');
    expect(type.getFields()).toMatchObject({
      nested1: { value: 'nested1' },
    });
  });

  it('getIpFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getIpFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticIpFields');
    expect(type.getFields()).toMatchObject({
      ip1: { value: 'ip1' },
    });
  });

  it('getAllFields()', () => {
    const type: EnumTypeComposer = (FieldNames.getAllFields(opts): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticAllFields');
    expect(type.getFields()).toMatchObject({
      boolean1: { value: 'boolean1' },
      date1: { value: 'date1' },
      double1: { value: 'double1' },
      float1: { value: 'float1' },
      geo1: { value: 'geo1' },
      int1: { value: 'int1' },
      ip1: { value: 'ip1' },
      keyword1: { value: 'keyword1' },
      nested1: { value: 'nested1' },
      text1: { value: 'text1' },
      text2: { value: 'text2' },
    });
  });

  it('should return string if mapping not provided', () => {
    expect(FieldNames.getStringFields()).toEqual('String');
    expect(FieldNames.getNumericFields()).toEqual('String');
    expect(FieldNames.getDateFields()).toEqual('String');
    expect(FieldNames.getBooleanFields()).toEqual('String');
    expect(FieldNames.getGeoPointFields()).toEqual('String');
    expect(FieldNames.getNestedFields()).toEqual('String');
    expect(FieldNames.getIpFields()).toEqual('String');
    expect(FieldNames.getAllFields()).toEqual('String');
  });
});
