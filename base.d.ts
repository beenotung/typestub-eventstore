import {EventEmitter} from "events";
import {EventStoreEvent} from "./event";

export declare class Store<A extends EventStoreEvent> extends EventEmitter {
    constructor(options?)

    connect(callback?: (err, queue) => void)

    disconnect(callback?: (err) => void)

    getNewId(callback: (err, id: string) => void)

    getEvents(query, skip: number, limit: number, callback: (err, events: A[]) => void)

    getEventsSince(commitStamp: Date, callback: (err, events: A[]) => void)
    getEventsSince(commitStamp: Date, skip: number, limit: number, callback: (err, events: A[]) => void)

    getEventsByRevision(query, revMin: number, revMax: number, callback: (err, events: A[]) => void)

    getSnapshot(query, revMax: number, callback: (err, snapshot) => void)

    addSnapshot(snap, callback?: () => void)

    cleanSnapshots(query, callback?: () => void)

    addEvents(evts: A[], callback?: (err) => void)

    getLastEvent(callback: (err, event: A) => void)
    getLastEvent(query, callback: (err, event: A) => void)

    getUndispatchedEvents(callback: (err, events: A[]) => void)
    getUndispatchedEvents(query, callback: (err, events: A[]) => void)


    setEventToDispatched(id: string, callback?: () => void)

    /** ONLY FOR TESTS! */
    clear(callback?: () => void)
}

