// @flow

import elasticsearch from 'elasticsearch';
import awsElasticConnection from './elasticAwsConnection';

// TODO: make test and production connections depends of NODE_ENV
const ELASTIC_HOST = `https://search-rabota-staging-vsl4lltip4tl46tzb556vc23uq.eu-west-1.es.amazonaws.com`;
const elasticClient = new elasticsearch.Client({
  host: ELASTIC_HOST,
  connectionClass: awsElasticConnection,
  amazonES: {
    region: /([^.]+).es.amazonaws.com/.exec(ELASTIC_HOST)[1],
    accessKey: 'AKIAI36RLINJS36JW7JQ',
    secretKey: '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',
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
