# Update Entity

## Fetch the Aggregate (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Get Snapshot from SnapshotDB (2)"]
  C --> D["Create new Aggregate instance (1)"]
  D --> D2["Map the Snapshot to the Aggregate Classical CQRS (1)"]:::mod
  D2 --> E["Get Events from the Event Store (2)"]:::mod
  E --> F{{"For each event in Events (3)"}}:::mod
  F --> G["Define an event type (2)"]:::mod
  G --> H["Apply an event on the Aggregate (1)"]:::mod
  H --"Next Event"--> F
  H --"All Events are applied"--> I@{ shape: lean-l, label: "Aggregate" }
  H --> J@{ shape: lean-l, label: "Command" }
```

## Fetch the Aggregate (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Get Snapshot from SnapshotDB (2)"]
  C --> D["Create new Aggregate instance (1)"]
  D --> E["Map the Snapshot to the Aggregate mCQRS (1)"]:::mod
  E --> I@{ shape: lean-l, label: "Aggregate" }
  E --> J@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Command, Aggregate (2)

| ID    | Name                                             | Type          | Weight |
|-------|--------------------------------------------------|---------------|--------|
| BCS1  | Map the Snapshot to the Aggregate Classical CQRS | sequence      | 1      |
| BCS2  | Get Events from the Event Store                  | function call | 2      |
| BCS3  | For each event in Events                         | iteration     | 3      |
| BCS4  | Define an event type                             | branch        | 2      |
| BCS5  | Apply an event on the Aggregate                  | sequence      | 1      |
| BCS6  | Map the Snapshot to the Aggregate mCQRS          | remove        | 1      |
| Total |                                                  |               | 10     |

**Migration Complexity:** 2 × 10 = **20**  

---

## Save Aggregate (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Events" }
  A1 --> B["Update cache (1)"]
  A2 --> B
  B --> C{"Meet condition to create a Snapshot (2)"}:::mod
  C --Yes--> D["Create a new Snapshot instance (1)"]:::mod
  D --> E1["Save Snapshot to the SnapshotDB (2)"]:::mod
  E1 --> E2["Save Events to the Event Store (2)"]
  C --"No"--> E2
  E2 --> F@{ shape: lean-l, label: "Events" }

```

## Save Aggregate (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Events" }
  A1 --> B["Update cache (1)"]
  A2 --> B
  B --> C["Save Events to the Event Store (2)"]
  B --> D["Save Aggregate to the SnapshotDB (2)"]:::mod
  C --> E@{ shape: lean-l, label: "Events" }
  D --> E
```

**Input/Output Parameters:** Aggregate, Events (2)

| ID    | Name                                | Type          | Weight |
|-------|-------------------------------------|---------------|--------|
| BCS1  | Meet condition to create a Snapshot | branch        | 2      |
| BCS2  | Create a new Snapshot instance      | sequence      | 1      |
| BCS3  | Save Snapshot to the SnapshotDB     | function call | 2      |
| BCS4  | Save Aggregate to the SnapshotDB    | remove        | 1      |
| Total |                                     |               | 6      |

**Migration Complexity:** 2 × 6 = **12**  

---

## Total

20 + 12 = 32
