# Eventual Consistency

## Handle Event - Update Projection (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]
  C --> D["Apply the event to the Projection (1)"]
  D --> E{"Version mismatch Error (2)"}
  E --"No"--> F["Save the Projection to Projection DB (2)"]
  E --Yes--> H["Get Projection Snapshot from the SnapshotDB (2)"]:::mod
  H --> I["Get Events from the Event Store (2)"]:::mod
  I --> J["Create new Projection instance based on Snapshot Data (1)"]:::mod
  J --> K1{{"For each event in Events (3)"}}:::mod
  K1 --> K2["Determine event type (2)"]:::mod
  K2 --> K3["Replay event onto Projection (1)"]:::mod
  K3 --"Next event"--> K1
  K3 --"All events are replayed" --> F
  F --> M@{ shape: lean-l, label: "Event" }
```

## Handle Event - Update Projection (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]
  C --> D["Apply the event to the Projection (1)"]
  D --> E{"Version mismatch Error (2)"}
  E --"No"--> F["Save the Projection to Projection DB (2)"]
  E --Yes--> H["Get Snapshot from the SnapshotDB (2)"]:::mod
  H --> L["Map Snapshot to Projection (1)"]:::mod
  L --> F
  F --> M@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

| ID    | Name                                                  | Type          | Weight |
|-------|-------------------------------------------------------|---------------|--------|
| BCS1  | Get Projection Snapshot from the SnapshotDB           | remove        | 1      |
| BCS2  | Get Events from the Event Store                       | remove        | 1      |
| BCS3  | Create new Projection instance based on Snapshot Data | remove        | 1      |
| BCS4  | For each event in Events                              | remove        | 1      |
| BCS5  | Determine event type                                  | remove        | 1      |
| BCS6  | Replay event onto Projection                          | remove        | 1      |
| BCS7  | Get Snapshot from the SnapshotDB                      | function call | 2      |
| BCS8  | Map Snapshot to Projection                            | sequence      | 1      |
| Total |                                                       |               | 9      |

**Migration Complexity:** 1 × 9 = **9**  

---

## Total

9
