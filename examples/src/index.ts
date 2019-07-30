import {EventStoreEvent} from 'typestub-eventstore/event'

import * as eventstore from 'typestub-eventstore';

let util = require('util');

interface DomainEvent extends EventStoreEvent {
  aggregate: string
  aggregateId: string
  context: any
}

let store = eventstore<DomainEvent>();
console.log({store});

function checkError(err) {
  if (err) {
    console.error(err);
    process.exit(1)
  }
}

store.getEventStream('streamId', (err, stream) => {
  checkError(err);
  console.log('old stream:', stream);
  stream.addEvents([
    {aggregate: 'demo', aggregateId: '1', context: {type: 'hello', data: 'world'}},
    {aggregate: 'demo', aggregateId: '2', context: {type: 'ping', data: 'pong'}},
  ]);
  stream.commit((err, stream) => {
    checkError(err);
    console.log('new stream:', stream);
    store.getEvents('streamId', (err, evts) => {
      checkError(err);
      console.log('events:', evts)
    })
  })
});

