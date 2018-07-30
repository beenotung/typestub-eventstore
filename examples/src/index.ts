import * as eventstore from "typestub-eventstore";

let util = require('util');

let store = eventstore().store;
console.log({store});
let context = {};

async function main() {
  await util.promisify(store.addEvents)([
    {type: 'hello', data: 'world', aggregateId: 1, aggregate: 'demo'},
    {type: 'ping', data: 'pong', aggregateId: 2, _general: 1, aggregate: 'demo'},
  ]);
  console.log('added events');
  let es = await util.promisify(store.getEvents)({type: 'hello'}, 0, Number.MAX_SAFE_INTEGER);
  console.log({es});
}

main()

