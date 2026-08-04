# Eventual Consistency

## Handle Event - Update Projection (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Event" }
  A --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]
  C --> D["Apply the event to the Projection (1)"]
  D --> E{"Version mismatch Error (2)"}
  E --"No"--> F["Save the Projection to Projection DB (2)"]
  E --Yes--> LG["Log the Projection version mismatch (2)"]
  LG --> H["Get Snapshot from the SnapshotDB (2)"]
  H --> L["Map Snapshot to Projection (1)"]
  L --> F
  F --> CP["Commit the Event processing position (2)"]
  CP --> MT["Send the Projection lag metric (2)"]
  MT --> M@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

## Handle Event - Update Projection (mCQRS+CoE)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Group of Events" }
  A --> B0["Ungroup events (1)"]:::mod
  B0 --> B1{{"For each event in the group (3)"}}:::mod
  B1 --> B["Take the Projection from ProjectionDB (2)"]
  B --> C["Determine event version (2)"]
  C --> D["Apply the event to the Projection (1)"]
  D --> E{"Version mismatch Error (2)"}
  E --"No"--> F["Save the Projection to Projection DB (2)"]
  E --Yes--> LG["Log the Projection version mismatch (2)"]
  LG --> H["Get Snapshot from the SnapshotDB (2)"]
  H --> L["Map Snapshot to Projection (1)"]
  L --> F
  F --"Next event"--> B1
  F --"All events are processed"--> CP["Commit the Event processing position (2)"]
  CP --> MT["Send the Projection lag metric (2)"]
  MT --> M@{ shape: lean-l, label: "Group of Events" }
```

**Input/Output Parameters:** Group of Events (1)

| ID    | Name                        | Type      | Weight |
|-------|-----------------------------|-----------|--------|
| BCS1  | Ungroup events              | sequence  | 1      |
| BCS2  | For each event in the group | iteration | 3      |
| Total |                             |           | 4      |

**Migration Complexity:** 1 × 4 = **4**  

---

## Notify Client (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#f00
  A@{ shape: lean-l, label: "Event" }
  A --> B["Get list of clients to notify (2)"]
  B --> C["Send notification (2)"]
  C --> D@{ shape: lean-l, label: "Event" }
```

**Input/Output Parameters:** Event (1)

## Notify Client (mCQRS+CoE)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Group of Events" }
  A --> B0["Ungroup events (1)"]:::mod
  B0 --> B1{{"For each event in the group (3)"}}:::mod
  B1 --> B["Get list of clients to notify (2)"]
  B --> C["Send notification (2)"]
  C --"Next event"--> B1
  C --"All events are processed"--> D@{ shape: lean-l, label: "Group of Events" }
```

**Input/Output Parameters:** Group of Events (1)

| ID    | Name                        | Type      | Weight |
|-------|-----------------------------|-----------|--------|
| BCS1  | Ungroup events              | sequence  | 1      |
| BCS2  | For each event in the group | iteration | 3      |
| Total |                             |           | 4      |

**Migration Complexity:** 1 × 4 = **4**  

---

## Total

4 + 4 = 8
