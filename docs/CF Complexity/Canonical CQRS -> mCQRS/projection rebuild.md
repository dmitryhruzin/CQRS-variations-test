# Projection Rebuild

## Get Info About the Projection (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Request" }
  A --> B["Fetch Projection metadata from DB: Event types that affect projection etc. (2)"]:::mod
  B --> D@{ shape: lean-l, label: "Projection Metadata" }
```

**Input/Output Parameters:** Request, Projection Metadata (2)

| ID    | Name                                                                       | Type   | Weight |
|-------|----------------------------------------------------------------------------|--------|--------|
| BCS1  | Fetch Projection metadata from DB: Event types that affect projection etc. | remove | 1      |
| Total |                                                                            |        | 1      |

**Migration Complexity:** 2 × 1 = **2**  

---

## Fetch Snapshot (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Request" }
  A --> B["Build query for fetching the Aggregate Snapshot (1)"]:::mod
  B --> C["Fetch snapshot from Projection SnapshotDB (2)"]:::mod
  C --> D@{ shape: lean-l, label: "Aggregate Snapshot" }
```

**Input/Output Parameters:** Request, Aggregate Snapshot (2)

| ID    | Name                                            | Type          | Weight |
|-------|-------------------------------------------------|---------------|--------|
| BCS1  | Build query for fetching the Aggregate Snapshot | sequence      | 1      |
| BCS2  | Fetch snapshot from Projection SnapshotDB       | function call | 2      |
| Total |                                                 |               | 3      |

**Migration Complexity:** 2 × 3 = **6**  

---

## Fetch Events (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Projection Metadata" }
  A --> B["Fetch Events from the Event Store (2)"]:::mod
  B --> D@{ shape: lean-l, label: "Events" }
  B --> E@{ shape: lean-l, label: "Projection Metadata" }
```

**Input/Output Parameters:** Projection Metadata, Events (2)

| ID    | Name                              | Type   | Weight |
|-------|-----------------------------------|--------|--------|
| BCS1  | Fetch Events from the Event Store | remove | 1      |
| Total |                                   |        | 1      |

**Migration Complexity:** 2 × 1 = **2**  

---

## Build New Projection (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Events" }
  A --> B["Create the Projection instance (1)"]
  B --> C{{"For each Event (3)"}}:::mod
  C --> D["Define the type of the Event (2)"]:::mod
  D --> E["Apply the Event onto the Projection (1)"]:::mod
  E --"Next Event"--> C
  E --"All Events are applied"--> F@{ shape: lean-l, label: "Projection" }
```

**Input/Output Parameters:** Events, Projection (2)

## Build New Projection (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Aggregate Snapshot" }
  A --> B["Create the Projection instance (1)"]
  B --> C["Fill the Projection with the Aggregate Snapshot data (1)"]:::mod
  C --> H@{ shape: lean-l, label: "Projection" }
```

**Input/Output Parameters:** Aggregate Snapshot, Projection (2)

| ID    | Name                                                 | Type     | Weight |
|-------|------------------------------------------------------|----------|--------|
| BCS1  | For each Event                                       | remove   | 1      |
| BCS2  | Define the type of the Event                         | remove   | 1      |
| BCS3  | Apply the Event onto the Projection                  | remove   | 1      |
| BCS4  | Fill the Projection with the Aggregate Snapshot data | sequence | 1      |
| Total |                                                      |          | 4      |

**Migration Complexity:** 2 × 4 = **8**

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

## Save Projection (mCQRS)

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

2 + 6 + 2 + 8 + 4 = 22
