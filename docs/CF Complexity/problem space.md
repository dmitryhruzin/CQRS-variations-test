# Problem Space

Since these calculations are made not over processes within the system, but over the process that developers perform to complete a typical task, there is no calculation of the modification metric. Also, the calculation is performed as the sum of all activities (without multiplying by the sum of parameters).

## User Data Deletion According to GDPR Requirements (Classical CQRS)

```mermaid
flowchart TD
  A@{ shape: lean-l, label: "Automation Tools" }
  A --> B["Create Event Store (1)"]
  B --> C["Implement transformation function (2)"]
  C --> D["Run data migration (3)"]
  D --> E["Rebuild all projections (3)"]
  E --> F["Testing (2)"]
  F -->G@{ shape: lean-l, label: "Tested System" }
```

**Implementation Complexity:** **11**

---

## User Data Deletion According to GDPR Requirements (mCQRS)

```mermaid
flowchart TD
  A@{ shape: lean-l, label: "Snapshot" }
  A --> B["Anonymize data in snapshot (1)"]
  B --> C["Rebuild dependent projections (1)"]
  C --> D["Anonymize data in Event Store (1)"]
  D --> F["Testing (1)"]
  F -->G@{ shape: lean-l, label: "Tested System" }
```

**Implementation Complexity:** **4**  

---

## Event Type Version Update Operation Activities (Classical CQRS)

```mermaid
flowchart TD
  A1@{ shape: lean-l, label: "Automation Tools" }
  A2@{ shape: lean-l, label: "New Event Type Version" }
  A1 --> B["Create Event Store (1)"]
  A2 --> B
  B --> C["Add new event type version (1)"]
  C --> D["Implement transformation function (2)"]
  D --> D1["Run data migration (3)"]
  D1 --> E["Rebuild all projections (3)"]
  E --> F["Testing (2)"]
  F -->G@{ shape: lean-l, label: "Tested System" }
```

**Implementation Complexity:** **12**  

---

## Event Type Version Update Operation Activities (mCQRS)

```mermaid
flowchart TD
  A1@{ shape: lean-l, label: "Snapshot" }
  A2@{ shape: lean-l, label: "New Event Type Version" }
  A1 --> B["Update event type version in snapshot (2)"]
  A2 --> B
  B --> C["Rebuild dependent projections (1)"]
  C --> F["Testing (2)"]
  F -->G@{ shape: lean-l, label: "Tested System" }
```

**Implementation Complexity:** **5**
