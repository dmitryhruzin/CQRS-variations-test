# Read Entity

## Create Query

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Request" }
  A --> B["Create Query (1)"]:::mod
  B --> C@{ shape: lean-l, label: "Query" }
```

**Input/Output Parameters:** Request, Query (2)

| ID    | Name         | Type     | Weight |
|-------|--------------|----------|--------|
| BCS1  | Create Query | sequence | 1      |
| Total |              |          | 1      |

**Implementation Complexity:** 2 × 1 = **2**  
**Modification Complexity:** 2 × 1 = **2**

---

## Validate Query

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Query" }
  A --> B{{"For each field in Query payload (3)"}}
  B --> C["Validate field (1)"]
  C:::mod -->|Next field| B
  C -->|All fields are validated| E@{ shape: lean-l, label: "Query" }
```

**Input/Output Parameters:** Query (1)

| ID    | Name                            | Type      | Weight |
|-------|---------------------------------|-----------|--------|
| BCS1  | For each field in Query payload | iteration | 3      |
| BCS2  | Validate field                  | sequence  | 1      |
| Total |                                 |           | 4      |

**Implementation Complexity:** 1 × 4 = **4**  
**Modification Complexity:** 1 × 1 = **1**

---

## Fetch Projection

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Query" }
  A --> B["Get projection from DB (2)"]:::mod
  B --> C@{ shape: lean-l, label: "Projection" }
```

**Input/Output Parameters:** Query, Projection (2)

| ID    | Name                    | Type          | Weight |
|-------|-------------------------|---------------|--------|
| BCS1  | Get projection from DB  | function call | 2      |
| Total |                         |               | 2      |

**Implementation Complexity:** 2 × 2 = **4**  
**Modification Complexity:** 2 × 2 = **4**

---

## Map Projection to DTO

```mermaid
flowchart TD
  classDef mod stroke:#0f0
  A@{ shape: lean-l, label: "Projection" }
  A --> B["Create DTO using projection's data (1)"]:::mod
  B --> C@{ shape: lean-l, label: "DTO" }
```

**Input/Output Parameters:** Projection, DTO (2)

| ID    | Name                                | Type     | Weight |
|-------|-------------------------------------|----------|--------|
| BCS1  | Create DTO using projection's data  | sequence | 1      |
| Total |                                     |          | 1      |

**Implementation Complexity:** 2 × 1 = **2**  
**Modification Complexity:** 2 × 1 = **2**
