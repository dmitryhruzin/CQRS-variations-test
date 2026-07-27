# Migration Time

46 минут на миграцию 1 create, 3 update, 4 eventual consistency и 1 projection rebuild. И второй раз потратил 67 минут на миграцию 1 create, 12 update, 9 eventual consistency и 1 projection rebuild

| Процесс              | Всего | Экз. | Среднее | CF | Импл mCQRS | Импл Classical CQRS |
|----------------------|-------|------|---------|----|------------|---------------------|
| create               | 13    | 2    | 6.5     | 4  | 18         | 31.83               |
| update               | 256   | 15   | 17.07   | 20 | 26.39      | 38.81               |
| eventual consistency | 154   | 13   | 11.85   | 9  | 15.21      | 21.91               |
| projection rebuild   | 38    | 2    | 19      | 20 | 34.43      | 58.43               |
| read                 | 0     | 0    | 0       | 0  | 16.08      | 18.33               |
