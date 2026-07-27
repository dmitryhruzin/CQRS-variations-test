# Create Entity

## Save Aggregate (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
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
  classDef mod stroke:#f00
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Events" }
  A1 --> B["Update cache (1)"]
  A2 --> B
  B --> C["Save Events to the Event Store (2)"]
  B --> D["Save Aggregate to the SnapshotDB (2)"]
  C --> E@{ shape: lean-l, label: "Events" }
  D --> E
  class D mod
```

**Input/Output Parameters:** Aggregate, Events (2)

| ID    | Name                             | Type   | Weight |
|-------|----------------------------------|--------|--------|
| BCS1  | Save Aggregate to the SnapshotDB | remove | 1      |
| Total |                                  |        | 1      |

**Migration Complexity:** 2 × 1 = **2**  

---

## Total

2
