# Update Entity

## Create Command

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Request" }
  A --> B["Create new Command instance (1)"]
  B:::mod -->C@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Request, Command (2)

| ID    | Name                        | Type     | Weight |
|-------|-----------------------------|----------|--------|
| BCS1  | Create new Command instance | sequence | 1      |
| Total |                             |          | 1      |

**Implementation Complexity:** 2 × 1 = **2**  
**Modification Complexity:** 2 × 1 = **2**

---

## Validate Command

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B{{"For each field in Command payload (3)"}}
  B --> C["Validate field (1)"]
  C:::mod -->|Next field| B
  C -->|All fields are validated| E@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Command (1)

| ID    | Name                              | Type      | Weight |
|-------|-----------------------------------|-----------|--------|
| BCS1  | For each field in Command payload | iteration | 3      |
| BCS2  | Validate field                    | sequence  | 1      |
| Total |                                   |           | 4      |

**Implementation Complexity:** 1 × 4 = **4**  
**Modification Complexity:** 1 × 1 = **1**

---

## Route Command

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B["Registration of the Command (1)"]
  B:::mod -->C@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Command (1)

| ID    | Name                        | Type     | Weight |
|-------|-----------------------------|----------|--------|
| BCS1  | Registration of the Command | sequence | 1      |
| Total |                             |          | 1      |

**Implementation Complexity:** 1 × 1 = **1**  
**Modification Complexity:** 1 × 1 = **1**

---

## Fetch the Aggregate (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Get Snapshot from SnapshotDB (2)"]
  C --> D["Create new Aggregate instance (1)"]
  D:::mod --> E["Get Events from the Event Store (2)"]
  E --> F{{"For each event in Events (3)"}}
  F --> G["Define an event type (2)"]
  G:::mod --> H["Apply an event on the Aggregate (1)"]
  H --"Next Event"--> F
  H:::mod --"All Events are applied"--> I@{ shape: lean-l, label: "Aggregate" }
  H --> J@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Command, Aggregate (2)

| ID    | Name                                | Type          | Weight |
|-------|-------------------------------------|---------------|--------|
| BCS1  | Get from cache                      | sequence      | 1      |
| BCS2  | Get Snapshot from SnapshotDB        | function call | 2      |
| BCS3  | Create new Aggregate instance       | sequence      | 1      |
| BCS4  | Get Events from the Event Store     | function call | 2      |
| BCS5  | For each event in Events            | iteration     | 3      |
| BCS6  | Define an event type                | branch        | 2      |
| BCS7  | Apply an event on the Aggregate     | sequence      | 1      |
| Total |                                     |               | 12     |

**Implementation Complexity:** 2 × 12 = **24**  
**Modification Complexity:** 2 × 4 = **8**

---

## Fetch the Aggregate (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B["Get from cache (1)"]
  B --> C["Get Snapshot from SnapshotDB (2)"]
  C --> D["Create new Aggregate instance (1)"]
  D:::mod --> E["Apply the Snapshot on the Aggregate (1)"]
  E:::mod --> I@{ shape: lean-l, label: "Aggregate" }
  E --> J@{ shape: lean-l, label: "Command" }
```

**Input/Output Parameters:** Command, Aggregate (2)

| ID    | Name                                  | Type          | Weight |
|-------|---------------------------------------|---------------|--------|
| BCS1  | Get from cache                        | sequence      | 1      |
| BCS2  | Get Snapshot from SnapshotDB          | function call | 2      |
| BCS3  | Create new Aggregate instance         | sequence      | 1      |
| BCS4  | Apply the Snapshot on the Aggregate   | sequence      | 1      |
| Total |                                       |               | 5      |

**Implementation Complexity:** 2 × 5 = **10**  
**Modification Complexity:** 2 × 2 = **4**

---

## Update Aggregate's State

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Command" }
  A1 --> B["Changes to the Aggregate's state according to the Command's instructions (1)"]:::mod
  A2 --> B
  B --> C["Generate Events (1)"]:::mod
  C --> D1@{ shape: lean-l, label: "Events" }
  C --> D2@{ shape: lean-l, label: "Aggregate" }
```

**Input/Output Parameters:** Aggregate, Command, Events (3)

| ID    | Name                                                                      | Type     | Weight |
|-------|---------------------------------------------------------------------------|----------|--------|
| BCS1  | Changes to the Aggregate's state according to the Command's instructions  | sequence | 1      |
| BCS2  | Generate Events                                                           | sequence | 1      |
| Total |                                                                           |          | 2      |

**Implementation Complexity:** 3 × 2 = **6**  
**Modification Complexity:** 3 × 2 = **6**

---

## Save Aggregate (Classical CQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Events" }
  A1 --> B["Update cache (1)"]
  A2 --> B
  B --> C{"Meet condition to create a Snapshot (2)"}:::mod
  C --Yes--> D["Create a new Snapshot instance (1)"]:::mod
  D --> E1["Save Snapshot to the SnapshotDB (2)"]
  E1 --> E2["Save Events to the Event Store (2)"]
  C --"No"--> E2
  E2 --> F@{ shape: lean-l, label: "Events" }

```

**Input/Output Parameters:** Aggregate, Events (2)

| ID    | Name                                | Type          | Weight |
|-------|-------------------------------------|---------------|--------|
| BCS1  | Update cache                        | sequence      | 1      |
| BCS2  | Meet condition to create a Snapshot | branch        | 2      |
| BCS3  | Create a new Snapshot instance      | sequence      | 1      |
| BCS4  | Save Events to the Event Store      | function call | 2      |
| BCS5  | Save Snapshot to the SnapshotDB     | function call | 2      |
| Total |                                     |               | 8      |

**Implementation Complexity:** 2 × 8 = **16**  
**Modification Complexity:** 2 × 3 = **6**

---

## Save Aggregate (mCQRS)

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A1@{ shape: lean-l, label: "Aggregate" }
  A2@{ shape: lean-l, label: "Events" }
  A1 --> B["Update cache (1)"]
  A2 --> B
  B --> C["Save Events to the Event Store (2)"]
  B --> D["Save Aggregate to the SnapshotDB (2)"]
  C --> E@{ shape: lean-l, label: "Events" }
  D --> E
```

**Input/Output Parameters:** Aggregate, Events (2)

| ID    | Name                             | Type          | Weight |
|-------|----------------------------------|---------------|--------|
| BCS1  | Update cache                     | sequence      | 1      |
| BCS2  | Save Events to the Event Store   | function call | 2      |
| BCS3  | Save Aggregate to the SnapshotDB | function call | 2      |
| Total |                                  |               | 5      |

**Implementation Complexity:** 2 × 5 = **10**  
**Modification Complexity:** 2 × 0 = **0**

---

## Dispatch Events

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Events" }
  A --> B["Send Events to the Event Bus (2)"]
  B --> D@{ shape: lean-l, label: "Events" }
```

**Input/Output Parameters:** Events (1)

| ID    | Name                         | Type          | Weight |
|-------|------------------------------|---------------|--------|
| BCS1  | Send Events to the Event Bus | function call | 2      |
| Total |                              |               | 2      |

**Implementation Complexity:** 1 × 2 = **2**  
**Modification Complexity:** 1 × 0 = **0**
