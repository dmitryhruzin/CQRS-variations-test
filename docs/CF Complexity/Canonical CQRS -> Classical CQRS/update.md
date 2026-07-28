# Update Entity

## Fetch the Aggregate (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Create new Aggregate instance (1)"]
  C --> D["Get Events from the Event Store (2)"]
  D --> E{{"For each event in Events (3)"}}
  E --> F["Define an event type (2)"]
  F --> G["Apply an event on the Aggregate (1)"]
  G --"Next Event"--> E
  G --"All Events are applied"--> H@{ shape: lean-l, label: "Aggregate" }
  G --> I@{ shape: lean-l, label: "Command" }
```

## Fetch the Aggregate (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Get Snapshot from SnapshotDB (2)"]:::mod
  C --> D["Create new Aggregate instance (1)"]
  D --> D2["Map the Snapshot to the Aggregate Classical CQRS (1)"]:::mod
  D2 --> E["Get Events from the Event Store (2)"]
  E --> F{{"For each event in Events (3)"}}
  F --> G["Define an event type (2)"]
  G --> H["Apply an event on the Aggregate (1)"]
  H --"Next Event"--> F
  H --"All Events are applied"--> I@{ shape: lean-l, label: "Aggregate" }
  H --> J@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Command, Aggregate (2)

| ID    | Name                                             | Type          | Weight |
|-------|--------------------------------------------------|---------------|--------|
| BCS1  | Get Snapshot from SnapshotDB                     | function call | 2      |
| BCS2  | Map the Snapshot to the Aggregate Classical CQRS | sequence      | 1      |
| Total |                                                  |               | 3      |

**Migration Complexity:** 2 × 3 = **6**  

---

## Save Aggregate (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Events" }
  A1 --> B["Update cache (1)"]
  A2 --> B
  B --> C["Save Events to the Event Store (2)"]
  C --> D@{ shape: lean-l, label: "Events" }
```

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

**Input/Output Parameters:** Aggregate, Events (2)

| ID    | Name                                | Type          | Weight |
|-------|-------------------------------------|---------------|--------|
| BCS1  | Meet condition to create a Snapshot | branch        | 2      |
| BCS2  | Create a new Snapshot instance      | sequence      | 1      |
| BCS3  | Save Snapshot to the SnapshotDB     | function call | 2      |
| Total |                                     |               | 5      |

**Migration Complexity:** 2 × 5 = **10**  

---

## Total

6 + 10 = 16
