# Migrations Summary

## CF Migration Complexity по классам процессов

| Миграция                           | create | update | eventual consistency | projection rebuild | read |
|------------------------------------|--------|--------|----------------------|--------------------|------|
| `Canonical CQRS -> Classical CQRS` | 0      | 20     | 17                   | 11                 | 0    |
| `Canonical CQRS -> mCQRS`          | 8      | 22     | 9                    | 22                 | 0    |
| `Classical CQRS -> mCQRS`          | 8      | 22     | 9                    | 20                 | 0    |
| `mCQRS -> Classical CQRS`          | 4      | 32     | 13                   | 33                 | 0    |
| `mCQRS -> mCQRS+CoE`               | 2      | 2      | 8                    | 0                  | 0    |

## Среднее время на один экземпляр процесса, минуты

| Миграция                           | create | update | eventual consistency | projection rebuild | read |
|------------------------------------|--------|--------|----------------------|--------------------|------|
| `Canonical CQRS -> Classical CQRS` | 0      | 17.5   | 15.88                | 13.5               | 0    |
| `Canonical CQRS -> mCQRS`          | 7      | 20.67  | 10.88                | 24                 | 0    |
| `Classical CQRS -> mCQRS`          | 6.5    | 17.07  | 11.85                | 19                 | 0    |
| `mCQRS -> Classical CQRS`          | 4.5    | 24.66  | 15.75                | 41.5               | 0    |
| `mCQRS -> mCQRS+CoE`               | 5.5    | 5.67   | 9.38                 | 0                  | 0    |

## Process Integration complexity

| (index)                  | create | update | eventual consistency | projection rebuild | read |
|--------------------------|--------|--------|----------------------|--------------------|------|
| canonicalToClassicalCQRS | 4      | 8.7    | 7.44                 | 6                  | 4    |
| canonicalToMCQRS         | 5.52   | 10     | 6                    | 10.4               | 4    |
| classicalToMCQRS         | 5.41   | 9.7    | 6                    | 8.9                | 4    |
| mCQRSToClassical         | 4.09   | 12.7   | 6.97                 | 16                 | 4    |
| mCQRSToMCQRSCoE          | 4.19   | 4.23   | 6                    | 4                  | 4    |

## Migration Integration complexity

| (index)                  | create | update | eventual consistency | projection rebuild | read |
|--------------------------|--------|--------|----------------------|--------------------|------|
| Count of processes       | 7      | 31     | 46                   | 12                 | 20   |

| (index)                  | create | update | eventual consistency | projection rebuild | read |  total  |
|--------------------------|--------|--------|----------------------|--------------------|------|---------|
| canonicalToClassicalCQRS | 28     | 269.7  | 342.24               | 72                 | 80   |  791.94 |
| canonicalToMCQRS         | 38.64  | 310    | 276                  | 124.8              | 80   |  829.44 |
| classicalToMCQRS         | 37.87  | 300.7  | 276                  | 106.8              | 80   |  801.37 |
| mCQRSToClassical         | 28.63  | 393.7  | 320.62               | 192                | 80   | 1014.95 |
| mCQRSToMCQRSCoE          | 29.33  | 131.13 | 276                  | 48                 | 80   |  564.46 |
