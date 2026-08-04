# Create Entity

## Save Aggregate (Canonical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Events" }
  A1 --> B["Update cache (1)"]
  A2 --> B
  B --> C["Save Events to the Event Store (2)"]
  C --> L["Log the persisted Events (2)"]
  L --> D@{ shape: lean-l, label: "Events" }
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
  C --> CF{"Both writes succeeded (2)"}:::mod
  D --> CF
  CF --Yes--> L["Log the persisted Events (2)"]
  CF --"No"--> X@{ shape: dbl-circ, label: "End" }
  L --> E@{ shape: lean-l, label: "Events" }
```

**Input/Output Parameters:** Aggregate, Events (2)

| ID    | Name                             | Type          | Weight |
|-------|----------------------------------|---------------|--------|
| BCS1  | Save Aggregate to the SnapshotDB | function call | 2      |
| BCS2  | Both writes succeeded            | branch        | 2      |
| Total |                                  |               | 4      |

**Migration Complexity:** 2 × 4 = **8**  

---

## Total

8
