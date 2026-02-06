# Eventual Consistency

## Route Event

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Event" }
  A --> B["Registration of the Event (1)"]
  B:::mod -->C@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

| ID    | Name                      | Type     | Weight |
|-------|---------------------------|----------|--------|
| BCS1  | Registration of the Event | sequence | 1      |
| Total |                           |          | 1      |

**Implementation Complexity:** 1 × 1 = **1**  
**Modification Complexity:** 1 × 1 = **1**

---

## Handle Event - Update Projection (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]:::mod
  C --> D["Apply the event to the Projection (1)"]:::mod
  D --> E{"Version mismatch Error (2)"}
  E --"No"--> F["Save the Projection to Projection DB (2)"]
  E --Yes--> H["Get Snapshot from the SnapshotDB (2)"]
  H --> I["Get Events from the Event Store (2)"]
  I --> J["Create new Aggregate instance based on Snapshot Data (1)"]
  J --> K1{{"For each event in Events (3)"}}
  K1 --> K2["Determine event type (2)"]
  K2 --> K3["Replay event onto Aggregate (1)"]
  K3 --"Next event"--> K1
  K3 --"All events are replayed"--> L["Map Aggregate to Projection (1)"]:::mod
  L --> F
  F --> M@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

| ID    | Name                                                 | Type          | Weight |
|-------|------------------------------------------------------|---------------|--------|
| BCS1  | Take the Projection from ProjectionDB                | function call | 2      |
| BCS2  | Determine event version                              | branch        | 2      |
| BCS3  | Apply the event to the Projection                    | sequence      | 1      |
| BCS4  | Version mismatch Error                               | branch        | 2      |
| BCS5  | Save the Projection to Projection DB                 | function call | 2      |
| BCS6  | Get Snapshot from the SnapshotDB                     | function call | 2      |
| BCS7  | Get Events from the Event Store                      | function call | 2      |
| BCS8  | Create new Aggregate instance based on Snapshot Data | sequence      | 1      |
| BCS9  | For each event in Events                             | iteration     | 3      |
| BCS10 | Determine event type                                 | branch        | 2      |
| BCS11 | Replay event onto Aggregate                          | sequence      | 1      |
| BCS12 | Map Aggregate to Projection                          | sequence      | 1      |
| Total |                                                      |               | 21     |

**Implementation Complexity:** 1 × 21 = **21**  
**Modification Complexity:** 1 × 4 = **4**

---

## Handle Event - Update Projection (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]:::mod
  C --> D["Apply the event to the Projection (1)"]:::mod
  D --> E{"Version mismatch Error (2)"}
  E --"No"--> F["Save the Projection to Projection DB (2)"]
  E --Yes--> H["Get Snapshot from the SnapshotDB (2)"]
  H --> L["Map Snapshot to Projection (1)"]:::mod
  L --> F
  F --> M@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

| ID    | Name                                  | Type          | Weight |
|-------|---------------------------------------|---------------|--------|
| BCS1  | Take the Projection from ProjectionDB | function call | 2      |
| BCS2  | Determine event version               | branch        | 2      |
| BCS3  | Apply the event to the Projection    | sequence      | 1      |
| BCS4  | Version mismatch Error                | branch        | 2      |
| BCS5  | Save the Projection to Projection DB | function call | 2      |
| BCS6  | Get Snapshot from the SnapshotDB     | function call | 2      |
| BCS7  | Map Snapshot to Projection           | sequence      | 1      |
| Total |                                       |               | 12     |

**Implementation Complexity:** 1 × 12 = **12**  
**Modification Complexity:** 1 × 4 = **4**

---

## Notify Client

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Event" }
  A --> B["Get list of clients to notify (2)"]:::mod
  B --> C["Send notification (2)"]
  C --> D@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

| ID    | Name                           | Type          | Weight |
|-------|--------------------------------|---------------|--------|
| BCS1  | Get list of clients to notify  | function call | 2      |
| BCS2  | Send notification              | function call | 2      |
| Total |                                |               | 4      |

**Implementation Complexity:** 1 × 4 = **4**  
**Modification Complexity:** 1 × 2 = **2**
