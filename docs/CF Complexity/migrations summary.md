# Migrations Summary

## CF Migration Complexity по классам процессов

| Миграция                           | create | update | eventual consistency | projection rebuild | read |
|------------------------------------|--------|--------|----------------------|--------------------|------|
| `Canonical CQRS -> Classical CQRS` | 0      | 16     | 15                   | 9                  | 0    |
| `Canonical CQRS -> mCQRS`          | 4      | 18     | 7                    | 20                 | 0    |
| `Classical CQRS -> mCQRS`          | 4      | 22     | 9                    | 20                 | 0    |
| `mCQRS -> Classical CQRS`          | 2      | 32     | 13                   | 33                 | 0    |
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
| canonicalToClassicalCQRS | 4      | 7.8    | 7.44                 | 6                  | 4    |
| canonicalToMCQRS         | 4.61   | 8      | 5.91                 | 9.3                | 4    |
| classicalToMCQRS         | 4.5    | 9.7    | 6                    | 8.9                | 4    |
| mCQRSToClassical         | 4      | 12.7   | 6.97                 | 16                 | 4    |
| mCQRSToMCQRSCoE          | 4.19   | 4.23   | 6                    | 4                  | 4    |

## Migration Integration complexity

| (index)                  | create | update | eventual consistency | projection rebuild | read |
|--------------------------|--------|--------|----------------------|--------------------|------|
| Count of processes       | 7      | 31     | 46                   | 12                 | 20   |

| (index)                  | create | update | eventual consistency | projection rebuild | read |  total  |
|--------------------------|--------|--------|----------------------|--------------------|------|---------|
| canonicalToClassicalCQRS | 28     | 241.8  | 342.24               | 72                 | 80   |  764.04 |
| canonicalToMCQRS         | 32.27  | 248    | 271.86               | 111.6              | 80   |  743.73 |
| classicalToMCQRS         | 31.5   | 300.7  | 276                  | 106.8              | 80   |     795 |
| mCQRSToClassical         | 28     | 393.7  | 320.62               | 192                | 80   | 1014.32 |
| mCQRSToMCQRSCoE          | 29.33  | 131.13 | 276                  | 48                 | 80   |  564.46 |
