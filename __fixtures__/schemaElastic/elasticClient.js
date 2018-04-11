// @flow

import elasticsearch from 'elasticsearch';
import awsElasticConnection from './elasticAwsConnection';

const ELASTIC_HOST = ``;
const elasticClient = new elasticsearch.Client({
  host: ELASTIC_HOST,
  connectionClass: awsElasticConnection,
  amazonES: {
    region: /([^.]+).es.amazonaws.com/.exec(ELASTIC_HOST)[1],
    accessKey: '',
    secretKey: '',
  },
  apiVersion: '5.0',
  // log: 'trace',
});

// elasticClient.ping(
//   {
//     requestTimeout: 30000,
//   },
//   error => {
//     if (error) {
//       console.error('   elasticsearch cluster is down'); // eslint-disable-line no-console
//     } else {
//       console.log('   connected to elasticsearch'); // eslint-disable-line no-console
//     }
//   }
// );

export default elasticClient;
