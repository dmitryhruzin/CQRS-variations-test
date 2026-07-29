# Update Entity

## Fetch the Aggregate (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Create new Aggregate instance (1)"]
  C --> D["Get Events from the Event Store (2)"]:::mod
  D --> E{{"For each event in Events (3)"}}:::mod
  E --> F["Define an event type (2)"]:::mod
  F --> G["Apply an event on the Aggregate (1)"]:::mod
  G --"Next Event"--> E
  G --"All Events are applied"--> H@{ shape: lean-l, label: "Aggregate" }
  G --> I@{ shape: lean-l, label: "Command" }
```

## Fetch the Aggregate (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Get Snapshot from SnapshotDB (2)"]:::mod
  C --> D["Create new Aggregate instance (1)"]
  D --> E["Map the Snapshot to the Aggregate mCQRS (1)"]:::mod
  E --> I@{ shape: lean-l, label: "Aggregate" }
  E --> J@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Command, Aggregate (2)

| ID    | Name                                    | Type          | Weight |
|-------|-----------------------------------------|---------------|--------|
| BCS1  | Get Events from the Event Store         | remove        | 1      |
| BCS2  | For each event in Events                | remove        | 1      |
| BCS3  | Define an event type                    | remove        | 1      |
| BCS4  | Apply an event on the Aggregate         | remove        | 1      |
| BCS5  | Get Snapshot from SnapshotDB            | function call | 2      |
| BCS6  | Map the Snapshot to the Aggregate mCQRS | sequence      | 1      |
| Total |                                         |               | 7      |

**Migration Complexity:** 2 × 7 = **14**  

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

## Save Aggregate (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
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

| ID    | Name                             | Type          | Weight |
|-------|----------------------------------|---------------|--------|
| BCS1  | Save Aggregate to the SnapshotDB | function call | 2      |
| Total |                                  |               | 2      |

**Migration Complexity:** 2 × 2 = **4**  

---

## Total

14 + 4 = 18
