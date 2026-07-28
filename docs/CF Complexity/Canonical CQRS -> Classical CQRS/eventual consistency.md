# Eventual Consistency

## Handle Event - Update Projection (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Apply the event to the Projection (1)"]
  C --> D["Save the Projection to Projection DB (2)"]
  D --> E@{ shape: lean-l, label: "Event" }
```

## Handle Event - Update Projection (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]:::mod
  C --> D["Apply the event to the Projection (1)"]
  D --> E{"Version mismatch Error (2)"}:::mod
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

**Input/Output Parameters:** Event (1)

| ID    | Name                                                  | Type          | Weight |
|-------|-------------------------------------------------------|---------------|--------|
| BCS1  | Determine event version                               | branch        | 2      |
| BCS2  | Version mismatch Error                                | branch        | 2      |
| BCS3  | Get Projection Snapshot from the SnapshotDB           | function call | 2      |
| BCS4  | Get Events from the Event Store                       | function call | 2      |
| BCS5  | Create new Projection instance based on Snapshot Data | sequence      | 1      |
| BCS6  | For each event in Events                              | iteration     | 3      |
| BCS7  | Determine event type                                  | branch        | 2      |
| BCS8  | Replay event onto Projection                          | sequence      | 1      |
| Total |                                                       |               | 15     |

**Migration Complexity:** 1 × 15 = **15**  

---

## Total

15
