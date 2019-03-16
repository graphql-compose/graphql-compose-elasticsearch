/* @flow */

import { schemaComposer, EnumTypeComposer } from 'graphql-compose';
import * as FieldNames from '../FieldNames';
import { prepareCommonOpts } from '../../../utils';

beforeEach(() => {
  schemaComposer.clear();
});

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
    const type: EnumTypeComposer<any> = (FieldNames.getStringFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
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
    const type: EnumTypeComposer<any> = (FieldNames.getNumericFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
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
    const type: EnumTypeComposer<any> = (FieldNames.getDateFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticDateFields');
    expect(type.getFields()).toMatchObject({
      date1: { value: 'date1' },
    });
  });

  it('getBooleanFields()', () => {
    const type: EnumTypeComposer<any> = (FieldNames.getBooleanFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticBooleanFields');
    expect(type.getFields()).toMatchObject({
      boolean1: { value: 'boolean1' },
    });
  });

  it('getGeoPointFields()', () => {
    const type: EnumTypeComposer<any> = (FieldNames.getGeoPointFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticGeoPointFields');
    expect(type.getFields()).toMatchObject({
      geo1: { value: 'geo1' },
    });
  });

  it('getNestedFields()', () => {
    const type: EnumTypeComposer<any> = (FieldNames.getNestedFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticNestedFields');
    expect(type.getFields()).toMatchObject({
      nested1: { value: 'nested1' },
    });
  });

  it('getIpFields()', () => {
    const type: EnumTypeComposer<any> = (FieldNames.getIpFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
    expect(type).toBeInstanceOf(EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticIpFields');
    expect(type.getFields()).toMatchObject({
      ip1: { value: 'ip1' },
    });
  });

  it('getAllFields()', () => {
    const type: EnumTypeComposer<any> = (FieldNames.getAllFields(
      prepareCommonOpts(schemaComposer, opts)
    ): any);
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
    expect(FieldNames.getStringFields(({}: any))).toEqual('String');
    expect(FieldNames.getNumericFields(({}: any))).toEqual('String');
    expect(FieldNames.getDateFields(({}: any))).toEqual('String');
    expect(FieldNames.getBooleanFields(({}: any))).toEqual('String');
    expect(FieldNames.getGeoPointFields(({}: any))).toEqual('String');
    expect(FieldNames.getNestedFields(({}: any))).toEqual('String');
    expect(FieldNames.getIpFields(({}: any))).toEqual('String');
    expect(FieldNames.getAllFields(({}: any))).toEqual('String');
  });
});
