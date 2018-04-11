/* @flow */
/* eslint-disable no-restricted-syntax, guard-for-in, func-names */

/**
 * A Connection handler for Amazon ES.
 *
 * Uses the aws-sdk to make signed requests to an Amazon ES endpoint.
 * Define the Amazon ES config and the connection handler
 * in the client configuration:
 *
 * var es = require('elasticsearch').Client({
 *  hosts: 'https://amazon-es-host.us-east-1.es.amazonaws.com',
 *  connectionClass: require('http-aws-es'),
 *  amazonES: {
 *    region: 'us-east-1',
 *    accessKey: 'AKID',
 *    secretKey: 'secret',
 *    credentials: new AWS.EnvironmentCredentials('AWS') // Optional
 *  }
 * });
 *
 * @param client {Client} - The Client that this class belongs to
 * @param config {Object} - Configuration options
 * @param [config.protocol=http:] {String} - The HTTP protocol that this connection will use, can be set to https:
 * @class HttpConnector
 */
import AWS from 'aws-sdk';
import HttpConnector from 'elasticsearch/src/lib/connectors/http';
import _ from 'elasticsearch/src/lib/utils';
import zlib from 'zlib';

export default class HttpAmazonESConnector extends HttpConnector {
  constructor(host: Object, config: Object) {
    super(host, config);
    this.endpoint = new AWS.Endpoint(host.host);
    const c = config.amazonES;
    if (c.credentials) {
      this.creds = c.credentials;
    } else {
      this.creds = new AWS.Credentials(c.accessKey, c.secretKey);
    }
    this.amazonES = c;
  }

  request(params: Object, cb: Function) {
    let incoming;
    let timeoutId;
    let req;
    let status = 0;
    let headers = {};
    const log = this.log;
    let response;

    const reqParams = this.makeReqParams(params);
    // general clean-up procedure to run after the request
    // completes, has an error, or is aborted.
    const cleanUp = _.bind(err => {
      clearTimeout(timeoutId);

      if (req) {
        req.removeAllListeners();
      }

      if (incoming) {
        incoming.removeAllListeners();
      }

      if (err instanceof Error === false) {
        err = void 0; // eslint-disable-line
      }

      log.trace(params.method, reqParams, params.body, response, status);
      if (err) {
        cb(err);
      } else {
        cb(err, response, status, headers);
      }
    }, this);

    const request = new AWS.HttpRequest(this.endpoint);

    // copy across params
    for (const p in reqParams) {
      request[p] = reqParams[p];
    }
    request.region = this.amazonES.region;
    if (params.body) request.body = params.body;
    if (!request.headers) request.headers = {};
    request.headers['presigned-expires'] = false;
    request.headers.Host = this.endpoint.host;

    // Sign the request (Sigv4)
    const signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(this.creds, new Date());

    const send = new AWS.NodeHttpClient();
    req = send.handleRequest(
      request,
      null,
      _incoming => {
        incoming = _incoming;
        status = incoming.statusCode;
        headers = incoming.headers;
        response = '';

        const encoding = (headers['content-encoding'] || '').toLowerCase();
        if (encoding === 'gzip' || encoding === 'deflate') {
          incoming = incoming.pipe(zlib.createUnzip());
        }

        incoming.setEncoding('utf8');
        incoming.on('data', d => {
          response += d;
        });

        incoming.on('error', cleanUp);
        incoming.on('end', cleanUp);
      },
      cleanUp
    );

    req.on('error', cleanUp);

    req.setNoDelay(true);
    req.setSocketKeepAlive(true);

    return function() {
      req.abort();
    };
  }
}
