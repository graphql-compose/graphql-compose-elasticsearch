/* @flow */

import elasticsearch from 'elasticsearch';

const elasticClient = new elasticsearch.Client({
  host: 'http://localhost:9200',
  apiVersion: '6.0',
  // log: 'trace',
});

export default elasticClient;
