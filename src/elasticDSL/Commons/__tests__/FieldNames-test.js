/* @flow */

import { GraphQLEnumType } from 'graphql-compose/lib/graphql';
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
    const type: any = FieldNames.getStringFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticStringFields',
      values: {
        keyword1: { value: 'keyword1' },
        text1: { value: 'text1' },
        text2: { value: 'text2' },
      },
    });
  });

  it('getNumericFields()', () => {
    const type: any = FieldNames.getNumericFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticNumericFields',
      values: {
        double1: { value: 'double1' },
        float1: { value: 'float1' },
        int1: { value: 'int1' },
      },
    });
  });

  it('getDateFields()', () => {
    const type: any = FieldNames.getDateFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticDateFields',
      values: {
        date1: { value: 'date1' },
      },
    });
  });

  it('getBooleanFields()', () => {
    const type: any = FieldNames.getBooleanFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticBooleanFields',
      values: {
        boolean1: { value: 'boolean1' },
      },
    });
  });

  it('getGeoPointFields()', () => {
    const type: any = FieldNames.getGeoPointFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticGeoPointFields',
      values: {
        geo1: { value: 'geo1' },
      },
    });
  });

  it('getNestedFields()', () => {
    const type: any = FieldNames.getNestedFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticNestedFields',
      values: {
        nested1: { value: 'nested1' },
      },
    });
  });

  it('getIpFields()', () => {
    const type: any = FieldNames.getIpFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticIpFields',
      values: {
        ip1: { value: 'ip1' },
      },
    });
  });

  it('getAllFields()', () => {
    const type: any = FieldNames.getAllFields(opts);
    expect(type).toBeInstanceOf(GraphQLEnumType);
    expect(type._enumConfig).toMatchObject({
      description: 'Avaliable fields from mapping.',
      name: 'ElasticAllFields',
      values: {
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
      },
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
