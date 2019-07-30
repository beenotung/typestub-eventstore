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

declare class EventStream<A extends EventStoreEvent> {
    events: A[];

    addEvent(event: A)

    addEvents(events: A[])

    commit(callback?: (err, stream: this) => void)

    on(type: 'data', callback: (e: A) => void)
    on(type: 'end', callback: () => void)

    pipe(writableStream: WritableStream)
}

declare class Snapshot {
    data
}

type Query = {
    aggregateId: string
    aggregate: string // optional, like class name
    context: string // optional, like package name
};
type StreamIdOrQuery = string | Query;

declare class EventStore<A extends EventStoreEvent> {
    constructor(options, store: StoreBase<A>)

    // optional
    useEventPublisher(publisher: (evt) => void): void
    useEventPublisher(publisher: (evt, callback) => void): void

    on(type: 'connect', callback: () => void)
    on(type: 'disconnect', callback: () => void)

    // optional
    defineEventMappings(fieldNames: {
        id?: string,
        commitId?: string,
        commitSequence?: string,
        commitStamp?: string,
        streamRevision?: string
    })

    init(callback?: (err) => void)

    getEventStream(
        streamIdOrQuery: StreamIdOrQuery,
        callback: (err, stream: EventStream<A>) => void,
    )
    getEventStream(
        streamIdOrQuery: StreamIdOrQuery,
        revMin: number,
        callback: (err, stream: EventStream<A>) => void,
    )
    getEventStream(
        streamIdOrQuery: StreamIdOrQuery,
        revMin: number,
        revMax: number | -1,
        callback: (err, stream: EventStream<A>) => void,
    )

    getFromSnapshot(
        streamIdOrQuery: StreamIdOrQuery,
        callback: (err, snapshot: Snapshot, stream: EventStream<A>) => void,
    )
    getFromSnapshot(
        streamIdOrQuery: StreamIdOrQuery,
        revMax: number | -1,
        callback: (err, snapshot: Snapshot, stream: EventStream<A>) => void,
    )

    createSnapshot(
        snapshot: {
            streamId: number,
            data: any,
            revision: number, // last revision
            version: number // optional
        } | {
            aggregateId: string,
            aggregate: string,          // optional
            context: string,                 // optional
            data: any,
            revision: number // last revision
            version: 1 // optional
        },
        callback: (err) => void
    )

    getUndispatchedEvents(callback: (err, evts) => void)
    getUndispatchedEvents(streamIdOrQuery: StreamIdOrQuery, callback: (err, evts) => void)

    setEventToDispatched(evtOrId: A | string, callback: (err) => void)

    getEvents(callback: (err, evts: A[]) => void)
    getEvents(skip: number, callback: (err, evts: A[]) => void)
    getEvents(skip: number, limit: number, callback: (err, evts: A[]) => void)
    getEvents(streamIdOrQuery: StreamIdOrQuery, callback: (err, evts: A[]) => void)
    getEvents(streamIdOrQuery: StreamIdOrQuery, skip: number, callback: (err, evts: A[]) => void)
    getEvents(streamIdOrQuery: StreamIdOrQuery, skip: number, limit: number, callback: (err, evts: A[]) => void)
    getEvents(streamIdOrQuery: StreamIdOrQuery, revMin: number, callback: (err, evts: A[]) => void)
    getEvents(streamIdOrQuery: StreamIdOrQuery, revMin: number, revMax: number | -1, callback: (err, evts: A[]) => void)

    getEventsSince(date: Date, callback: (err, evts: A[]) => void)
    getEventsSince(date: Date, skip: number, callback: (err, evts: A[]) => void)
    getEventsSince(date: Date, skip: number, limit: number, callback: (err, evts: A[]) => void)

    streamEvents(): EventStream<A>
    streamEvents(skip: number): EventStream<A>
    streamEvents(skip: number, limit: number): EventStream<A>

    streamEventsSince(date: Date): EventStream<A>
    streamEventsSince(date: Date, skip: number): EventStream<A>
    streamEventsSince(date: Date, skip: number, limit: number): EventStream<A>

    streamEventsByRevision(query: Query): EventStream<A>

    getLastEvent(streamIdOrQuery: StreamIdOrQuery, callback: (err, evt: A) => void)

    getNewId(callback: (err, newId) => void)
}


declare interface eventstore {
    <A extends EventStoreEvent>(options?): EventStore<A>
}


declare function eventstore<A extends EventStoreEvent>(
    options?:
        // default is in-memory
        | {
        type: 'mongodb',
        host?: string                       // 'localhost'
        port?: number                       // 27017
        dbName?: string                     // 'eventstore'
        eventsCollectionName?: string       // 'events'
        snapshotsCollectionName?: string    // 'snapshots'
        transactionsCollectionName?: string // 'transactions'
        timeout?: number                    // 10000
        maxSnapshotsCount?: number          // e.g. 3 , defaultly will keep all snapshots
        authSource?: string                 // 'authedicationDatabase'
        username?: string                   // 'technicalDbUser'
        password?: string                   // 'secret'
        url?: string                        // 'mongodb://user:pass@host:port/db?opts'
        positionsCollectionName?: string    // e.g. 'positions', defaultly wont keep position
    } | {
        type: 'redis',
        host?: string // 'localhost',                          // optional
        port?: number // 6379,                                 // optional
        db?: number // 0,                                      // optional
        prefix?: string // 'eventstore',                       // optional
        eventsCollectionName?: string // 'events',             // optional
        snapshotsCollectionName?: string // 'snapshots',       // optional
        timeout?: number // 10000                              // optional
        maxSnapshotsCount?: number // 3                        // optional, defaultly will keep all snapshots
        password?: string // 'secret'                          // optional
    } | {
        type: 'tingodb',
        dbPath?: string // '/path/to/my/db/file',              // optional
        eventsCollectionName?: string // 'events',             // optional
        snapshotsCollectionName?: string // 'snapshots',       // optional
        transactionsCollectionName?: string // 'transactions', // optional
        timeout?: number // 10000                              // optional
        maxSnapshotsCount?: number // 3                        // optional, defaultly will keep all snapshots
    } | {
        type: 'elasticsearch',
        host?: string // 'localhost:9200',                     // optional
        indexName?: string // 'eventstore',                    // optional
        eventsTypeName?: string // 'events',                   // optional
        snapshotsTypeName?: string // 'snapshots',             // optional
        log?: string // 'warning',                             // optional
        maxSearchResults?: number // 10000                     // optional
        maxSnapshotsCount?: number // 3                        // optional, defaultly will keep all snapshots
    } | {
        type: 'azuretable',
        storageAccount: string // 'nodeeventstore',
        storageAccessKey: string // 'aXJaod96t980AbNwG9Vh6T3ewPQnvMWAn289Wft9RTv+heXQBxLsY3Z4w66CI7NN12+1HUnHM8S3sUbcI5zctg==',
        storageTableHost: string // 'https://nodeeventstore.table.core.windows.net/',
        eventsTableName?: string // 'events',             // optional
        snapshotsTableName?: string // 'snapshots',       // optional
        timeout?: number // 10000                              // optional
    } | {
        type: 'dynamodb',
        eventsTableName?: string // 'events',                  // optional
        snapshotsTableName?: string // 'snapshots',            // optional
        undispatchedEventsTableName?: string // 'undispatched' // optional
        EventsReadCapacityUnits?: number // 1,                 // optional
        EventsWriteCapacityUnits?: number // 3,                // optional
        SnapshotReadCapacityUnits?: number // 1,               // optional
        SnapshotWriteCapacityUnits?: number // 3,              // optional
        UndispatchedEventsReadCapacityUnits?: number // 1,     // optional
        UndispatchedEventsReadCapacityUnits?: number // 1,     // optional
        useUndispatchedEventsTable?: boolean // true            // optional
        eventsTableStreamEnabled?: boolean // false             // optional
        eventsTableStreamViewType?: string // 'NEW_IMAGE'      // optional
    }
): EventStore<A>

declare namespace eventstore {
    export class Store<A extends EventStoreEvent> extends StoreBase<A> {
    }

    export let domain: Domain;
}


