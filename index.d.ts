import {Store as StoreBase} from "./base";
import {Domain} from "./domain";
import {EventStoreEvent} from "./event";

export as namespace eventstore;
export = eventstore;

declare interface EventStoreOptions {
    type: Function
        | 'azuretable'
        | 'dynamodb'
        | 'elasticsearch'
        | 'inmemory'
        | 'mongodb'
        | 'redis'
        | 'tingodb'
}

declare class EventStore<A extends EventStoreEvent> {
    constructor(options, store: StoreBase<A>)
}


declare interface eventstore {
    <A extends EventStoreEvent>(options?): EventStore<A>
}


declare class eventstore {
    static<A extends EventStoreEvent>(): EventStore<A>
}

declare namespace eventstore {
    export class Store<A extends EventStoreEvent> extends StoreBase<A> {
    }

    export let domain: Domain;
}


