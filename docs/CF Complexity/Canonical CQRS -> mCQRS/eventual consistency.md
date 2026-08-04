# Eventual Consistency

## Handle Event - Update Projection (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Apply the event to the Projection (1)"]
  C --> D["Save the Projection to Projection DB (2)"]
  D --> CP["Commit the Event processing position (2)"]
  CP --> MT["Send the Projection lag metric (2)"]
  MT --> E@{ shape: lean-l, label: "Event" }
```

## Handle Event - Update Projection (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]:::mod
  C --> D["Apply the event to the Projection (1)"]
  D --> E{"Version mismatch Error (2)"}:::mod
  E --"No"--> F["Save the Projection to Projection DB (2)"]
  E --Yes--> LG["Log the Projection version mismatch (2)"]:::mod
  LG --> H["Get Snapshot from the SnapshotDB (2)"]:::mod
  H --> L["Map Snapshot to Projection (1)"]:::mod
  L --> F
  F --> CP["Commit the Event processing position (2)"]
  CP --> MT["Send the Projection lag metric (2)"]
  MT --> M@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

| ID    | Name                                | Type          | Weight |
|-------|-------------------------------------|---------------|--------|
| BCS1  | Determine event version             | branch        | 2      |
| BCS2  | Version mismatch Error              | branch        | 2      |
| BCS3  | Log the Projection version mismatch | function call | 2      |
| BCS4  | Get Snapshot from the SnapshotDB    | function call | 2      |
| BCS5  | Map Snapshot to Projection          | sequence      | 1      |
| Total |                                     |               | 9      |

**Migration Complexity:** 1 × 9 = **9**  

---

## Total

9
