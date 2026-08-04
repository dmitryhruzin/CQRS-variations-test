# Projection Rebuild

## Fetch Snapshot (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Projection Metadata" }
  A --> B["Fetch snapshot from Projection SnapshotDB (2)"]:::mod
  B --> D@{ shape: lean-l, label: "Projection Snapshot" }
  B --> E@{ shape: lean-l, label: "Projection Metadata" }
```

**Input/Output Parameters:** Projection Metadata, Projection Snapshot (2)

| ID    | Name                                      | Type          | Weight |
|-------|-------------------------------------------|---------------|--------|
| BCS1  | Fetch snapshot from Projection SnapshotDB | function call | 2      |
| Total |                                           |               | 2      |

**Migration Complexity:** 2 × 2 = **4**  

---

## Build New Projection (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Events" }
  A --> B["Create the Projection instance (1)"]
  B --> C{{"For each Event (3)"}}
  C --> D["Define the type of the Event (2)"]
  D --> E["Apply the Event onto the Projection (1)"]
  E --"Next Event"--> C
  E --"All Events are applied"--> F@{ shape: lean-l, label: "Projection" }
```

## Build New Projection (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A1@{ shape: lean-l, label: "Events" }
  A2@{ shape: lean-l, label: "Projection Snapshot" }
  A1 --> B["Create the Projection instance (1)"]
  A2 --> B
  B --> C["Fill the Projection with the Projection Snapshot data (1)"]:::mod
  C --> D{{"For each Event (3)"}}
  D --> E["Define the type of the Event (2)"]
  E --> F["Apply the Event onto the Projection (1)"]
  F --"Next Event"--> D
  F --"All Events are applied"--> H@{ shape: lean-l, label: "Projection" }
```

**Input/Output Parameters:** Events, Projection Snapshot, Projection (3)

| ID    | Name                                                  | Type     | Weight |
|-------|-------------------------------------------------------|----------|--------|
| BCS1  | Fill the Projection with the Projection Snapshot data | sequence | 1      |
| Total |                                                       |          | 1      |

**Migration Complexity:** 3 × 1 = **3**  

---

## Save Projection (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Projection" }
  A --> B["Save projection to the database (2)"]
  B --> CP["Save the rebuild checkpoint (2)"]
  CP --> LG["Log the projection rebuild completion (2)"]
  LG --> C@{ shape: dbl-circ, label: "End" }
```

## Save Projection (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Projection" }
  A --> B["Save projection to the database (2)"]
  A --> C["Save new projection snapshot to the database (2)"]:::mod
  B --> CF{"Both writes succeeded (2)"}:::mod
  C --> CF
  CF --Yes--> CP["Save the rebuild checkpoint (2)"]
  CP --> LG["Log the projection rebuild completion (2)"]
  LG --> D@{ shape: dbl-circ, label: "End" }
  CF --"No"--> D
```

**Input/Output Parameters:** Projection (1)

| ID    | Name                                         | Type          | Weight |
|-------|----------------------------------------------|---------------|--------|
| BCS1  | Save new projection snapshot to the database | function call | 2      |
| BCS2  | Both writes succeeded                        | branch        | 2      |
| Total |                                              |               | 4      |

**Migration Complexity:** 1 × 4 = **4**  

---

## Total

4 + 3 + 4 = 11
