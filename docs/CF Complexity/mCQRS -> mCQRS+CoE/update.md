# Update Entity

## Dispatch Events (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Events" }
  A --> B["Send Events to the Event Bus (2)"]
  B --> D@{ shape: lean-l, label: "Events" }
```

**Input/Output Parameters:** Events (1)

## Dispatch Events (mCQRS+CoE)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Events" }
  A --> B["Create a Group of Events (1)"]:::mod
  B --> C["Send the Group to the Event Bus (2)"]
  C --> D@{ shape: lean-l, label: "Group of Events" }
```

**Input/Output Parameters:** Events, Group of Events (2)

| ID    | Name                         | Type          | Weight |
|-------|------------------------------|---------------|--------|
| BCS1  | Create a Group of Events     | sequence      | 1      |
| Total |                              |               | 1      |

**Migration Complexity:** 2 × 1 = **2**

---

## Total

2
