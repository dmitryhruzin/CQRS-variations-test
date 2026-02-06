# Create Entity

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

## Create the Aggregate

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Command" }
  A --> B["Create new Aggregate instance (1)"]
  B:::mod --> C@{ shape: lean-l, label: "Aggregate" }
  B --> D@{ shape: lean-l, label: "Events" }
```

**Input/Output Parameters:** Command, Aggregate, Events (3)

| ID    | Name                          | Type     | Weight |
|-------|-------------------------------|----------|--------|
| BCS1  | Create new Aggregate instance | sequence | 1      |
| Total |                               |          | 1      |

**Implementation Complexity:** 3 × 1 = **3**  
**Modification Complexity:** 3 × 1 = **3**

---

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

**Input/Output Parameters:** Aggregate, Events (2)

| ID    | Name                           | Type          | Weight |
|-------|--------------------------------|---------------|--------|
| BCS1  | Update cache                   | sequence      | 1      |
| BCS2  | Save Events to the Event Store | function call | 2      |
| Total |                                |               | 3      |

**Implementation Complexity:** 2 × 3 = **6**  
**Modification Complexity:** 2 × 0 = **0**

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
