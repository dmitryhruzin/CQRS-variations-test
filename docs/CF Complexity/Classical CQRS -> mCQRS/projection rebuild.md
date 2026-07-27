# Projection Rebuild

## Get Info About the Projection (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Request" }
  A --> B["Fetch Projection metadata from DB: Event types that affect projection etc. (2)"]:::mod
  B --> D@{ shape: lean-l, label: "Projection Metadata" }
```

**Input/Output Parameters:** Request, Projection Metadata (2)

| ID    | Name                                                                       | Type          | Weight |
|-------|----------------------------------------------------------------------------|---------------|--------|
| BCS1  | Fetch Projection metadata from DB: Event types that affect projection etc. | remove        | 1      |
| Total |                                                                            |               | 1      |

**Migration Complexity:** 1 × 2 = **2**  

---

## Fetch Snapshot (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Projection Metadata" }
  A --> B["Fetch snapshot from Projection SnapshotDB (2)"]
  B --> D@{ shape: lean-l, label: "Projection Snapshot" }
  B --> E@{ shape: lean-l, label: "Projection Metadata" }
```

## Fetch Snapshot (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Request" }
  A --> B["Build query for fetching the Aggregate Snapshot (1)"]:::mod
  B --> C["Fetch snapshot from Projection SnapshotDB (2)"]
  C --> D@{ shape: lean-l, label: "Aggregate Snapshot" }
```

**Input/Output Parameters:** Request, Aggregate Snapshot (2)

| ID    | Name                                            | Type          | Weight |
|-------|-------------------------------------------------|---------------|--------|
| BCS1  | Build query for fetching the Aggregate Snapshot | sequence      | 1      |
| Total |                                                 |               | 1      |

**Migration Complexity:** 2 × 1 = **2**  

---

## Fetch Events (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Projection Metadata" }
  A --> B["Fetch Events from the Event Store (2)"]:::mod
  B --> D@{ shape: lean-l, label: "Events" }
  B --> E@{ shape: lean-l, label: "Projection Metadata" }
```

**Input/Output Parameters:** Projection Metadata, Events (2)

| ID    | Name                                | Type          | Weight |
|-------|-------------------------------------|---------------|--------|
| BCS1  | Fetch Events from the Event Store   | remove        | 1      |
| Total |                                     |               | 1      |

**Migration Complexity:** 2 × 1 = **2**  

---

## Build New Projection (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A1@{ shape: lean-l, label: "Events" }
  A2@{ shape: lean-l, label: "Projection Snapshot" }
  A1 --> B["Create the Projection instance (1)"]
  A2 --> B
  B --> C["Fill the Projection with the Projection Snapshot data (1)"]:::mod
  C --> D{{"For each Event (3)"}}:::mod
  D --> E["Define the type of the Event (2)"]:::mod
  E --> F["Apply the Event onto the Projection (1)"]:::mod
  F --"Next Event"--> D
  F --"All Events are applied"--> H@{ shape: lean-l, label: "Projection" }
```

**Input/Output Parameters:** Events, Projection Snapshot, Projection (3)

| ID    | Name                                                  | Type     | Weight |
|-------|-------------------------------------------------------|----------|--------|
| BCS1  | Fill the Projection with the Projection Snapshot data | remove   | 1      |
| BCS2  | For each Event                                        | remove   | 1      |
| BCS3  | Define the type of the Event                          | remove   | 1      |
| BCS4  | Apply the Event onto the Projection                   | remove   | 1      |
| Total |                                                       |          | 4      |

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

| ID    | Name                                                  | Type     | Weight |
|-------|-------------------------------------------------------|----------|--------|
| BCS5  | Fill the Projection with the Aggregate Snapshot data  | sequence | 1      |
| Total |                                                       |          | 1      |

**Migration Complexity:** 2 × 1 + 3 × 4 = **14**

---

## Total

2 + 2 + 2 + 14 = 20
