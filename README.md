# typestub-eventstore
[![npm Package Version](https://img.shields.io/npm/v/typestub-eventstore.svg?maxAge=2592000)](https://www.npmjs.com/package/typestub-eventstore)

## To Do
The type of Event related api is incorrect, the event returned is
```
Event {
    streamId: 'streamId',
    aggregateId: 'streamId',
    aggregate: undefined,
    context: undefined,
    streamRevision: 0,
    commitId: '1275408f-c379-46fb-8548-de7a5d664f36',
    commitSequence: 0,
    commitStamp: 2019-07-30T05:19:46.180Z,
    payload: { aggregate: 'demo', aggregateId: '1', context: [Object] },
    position: null,
    applyMappings: [Function: applyMappings],
    id: '1275408f-c379-46fb-8548-de7a5d664f360',
    restInCommitStream: 1 }
```
The expected event fields are wrapper in the payload
