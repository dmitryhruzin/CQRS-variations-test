```mermaid
---
title: Sequence diagram of the Fetching Aggregate workflow
---
  sequenceDiagram 
    participant ch as Command Handler
    participant r as Repository
    participant c as Cache
    participant es as Event Store

    ch->>r: Requests Aggregate by ID and version
    r ->> c: Requests Aggregate by ID and version
    
    alt Cache Hit
      c -->> r: Aggregate
      r -->> ch: Aggregate
    else Cache Miss
      c -->> r: Missing: no Aggregate
      r->>es: Requests events for the Aggregate
      es-->>r: Events
      r->>r: Create new Aggregate instance
      r->>r: Iteratively apply all events to reconstruct a new Aggregate instance
      r ->> c: Save the Aggregate
      r-->>ch: Aggregate
    end
```

```mermaid
---
title: Sequence diagram of the Command Processing Unit workflow
---
  sequenceDiagram 
    participant c as Client<br>...<br>Command Bus
    participant ch as Command Handler
    participant r as Repository
    participant a as Aggregate
    participant es as Event Store
    participant eb as Event Bus

    c->>ch: Command
    ch->>r: Requests Aggregate by ID
    r->>es: Requests events for the Aggregate
    es-->>r: Events
    r->>r: Builds Aggregate
    r-->>ch: Aggregate
    ch->>a: Invokes Aggregate's method
    a->>a: Updates it's state and prepares the list of events
    a-->>ch: List of events
    ch->>r: Saves events
    r->>es: Events
    es-->>r: Saved
    r-->>ch: Saved
    ch-->>c: Ack/Nak response
    ch-)eb: Dispatches events
```

```mermaid
---
title: Sequence diagram of the Update Projections workflow
---
  sequenceDiagram 
    participant eb as Event Bus
    participant eh as Event Handler
    participant db as Projection DB
    participant el as Error Log
    participant ns as Notification Service
    participant c as Clients

    eb-)eh: Event
    eb-)ns: Event
    ns-)c: Notifies clients
    eh->>db: Updates Projection
    alt Successful case
        db-->>eh: Updated
    else Version missmatch
      loop Retry defined number of times
        db-->>eh: Error
        eh->>eh: Wait defined time
        eh->>db: Retry
      end
      alt Success after retry
        db-->>eh: Updated
      else Retry limit exceeded
        db-->>eh: Error
        eh->>el: Logs the error to solve manually
      end  
    end
```

```mermaid
---
title: Asynchronous events order
---
  sequenceDiagram
    participant es as Event Store
    participant eb as Event Bus
    participant weh as Withdrawal Event Handler
    participant deh as Deposit Event Handler
    participant d as Database

    es-)eb: Sends Withdrawal Event
    es-)eb: Sends Deposit Event
    eb-)deh: Message with Deposit Event 
    eb-)weh: Reads Message with Withdrawal Event 
    deh->>d: Update DB 
    weh->>d: Update DB 
```

```mermaid
---
title: The write operation flow in the proposed approach
---
  sequenceDiagram 
    participant c as Client<br>...<br>Command Bus
    participant ch as Command Handler
    participant r as Unit of Work<br>(Repositories)
    participant a as Aggregate
    participant sdb as Snapshot DB
    participant es as Event Store
    participant eb as Event Bus

    c->>ch: Command
    ch->>r: Requests Aggregate by ID
    r->>sdb: Requests snapshot for the Aggregate
    sdb-->>r: Snapshot
    r->>r: Creates Aggregate based on Snapshot
    r-->>ch: Aggregate
    ch->>a: Invokes Aggregate's method
    a->>a: Prepares the list of events
    a->>a: Subscribes on events and synchronously emit them<br>(updates it's state and validates events)
    a-->>ch: List of events
    ch->>r: Saves the Aggregate's state<br>(within one transaction)
    par transaction
        r->>sdb: Snapshot
        sdb-->>r: Saved
    and
        r->>es: Events
        es-->>r: Saved
    end
    r-->>ch: Saved
    ch-->>c: Ack/Nak response
    ch-)eb: Dispatches events
```

```mermaid
---
title: Projections update in the proposed approach
---
sequenceDiagram
    participant eb as Event Bus
    participant eh as Event Handler
    participant db as Projection DB
    participant el as Error Log
    participant d as Domain
    participant ns as Notification Service
    participant c as Clients

    eb-)eh: Event
    eb-)ns: Event
    ns-)c: Notifies clients
        eh->>db: Updates Projection
    alt Successful case
        db-->>eh: Updated
    else Version missmatch
        db-->>eh: Error
        eh->>el: Logs the error
        eh->>d: Requests the latest Snapshot
        d-->>eh: Snapshot
        eh->>eh: Map Snapshot to Projection DTO
        eh->>db: Updates Projection
        db-->>eh: Updated
    end
```
