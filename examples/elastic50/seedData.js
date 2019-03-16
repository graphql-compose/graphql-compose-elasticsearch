/* @flow */

import elasticsearch from 'elasticsearch';
import seedData from './seedData.json';

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

const body = [];
seedData.forEach(row => {
  const { id, ...restData } = row;
  body.push({ index: { _index: 'demo_user', _type: 'demo_user', _id: id } }, restData);
});

client
  .bulk({
    index: 'demo_user',
    type: 'demo_user',
    body,
  })
  .then(() => {
    console.log('Data successfully seeded!');
  });
