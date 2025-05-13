const classes = [
  { name: 'very simple', value: 4 },
  { name: 'simple', value: 6 },
  { name: 'average', value: 8 },
  { name: 'complex', value: 12 },
  { name: 'very complex', value: 16 }
]

const cyclomaticMaxValue = 25
const cognitiveMaxValue = 22

const integrate = (func, a, b, n = 1000) => {
  const h = (b - a) / n
  let sum = 0.5 * (func(a) + func(b))

  for (let i = 1; i < n; i += 1) {
    sum += func(a + i * h)
  }

  return sum * h
}

const getClassValue = (value, xAxis) => {
  const chunksCount = classes.length * 2 - 1
  const chunk = xAxis / chunksCount

  for (let i = 0; i < classes.length; i += 1) {
    if (2 * i * chunk <= value && value <= (2 * i + 1) * chunk) {
      return classes[i].value
    }
    if ((2 * i + 1) * chunk < value && value < (2 * i + 2) * chunk && i < classes.length - 1) {
      // return [
      //   { part: Math.round(((value - (2 * i + 1) * chunk) / chunk) * 100), class: classes[i + 1] },
      //   { part: Math.round((((2 * i + 2) * chunk - value) / chunk) * 100), class: classes[i] }
      // ]
      return (
        [
          {
            part: Math.round(
              Math.sqrt(integrate((x) => 1 - x / chunk, value - (2 * i + 1) * chunk, chunk) / (chunk / 2)) * 100
            ),
            class: classes[i]
          },
          {
            part: Math.round(
              Math.sqrt(integrate((x) => x / chunk, 0, value - (2 * i + 1) * chunk) / (chunk / 2)) * 100
            ),
            class: classes[i + 1]
          }
        ].reduce((res, c) => res + c.class.value * c.part, 0) / 100
      )
    }
  }
  throw new Error(`Value ${value} is higher than ${xAxis}`)
}

// for (let i = 1; i < 26; i += 1) {
//   console.log(`${i}:`, getClassValue(i))
// }

const calculateComplexity = (cyclomaticSource, cognitiveSource) => {
  console.log('\n McCabe complexity')

  const cyclomatic = cyclomaticSource.map((m) => ({
    ...m,
    complexity: getClassValue(m.complexity, cyclomaticMaxValue)
  }))
  const cyclomaticTotal = cyclomatic.reduce((res, m) => res + m.complexity, 0).toFixed(2)

  console.log('By activities', cyclomatic)
  console.log('Total', cyclomaticTotal)

  console.log('\n Cognitive functional complexity')

  const сognitive = cognitiveSource.map((m) => ({
    ...m,
    complexity: getClassValue(m.complexity, cognitiveMaxValue)
  }))
  const сognitiveTotal = сognitive.reduce((res, m) => res + m.complexity, 0).toFixed(2)

  console.log('By activities', сognitive)
  console.log('Total', сognitiveTotal)

  console.log('\n Total complexity', (0.5 * сognitiveTotal + 0.5 * cyclomaticTotal).toFixed(2))
}

// ========== Implementation =========

console.log('\n Implementation')
console.log('\n Command')
console.log('Classical CQRS')
calculateComplexity(
  [
    { activityName: 'Create command', complexity: 1 },
    { activityName: 'Validate command', complexity: 13.5 },
    { activityName: 'Route command', complexity: 2 },
    { activityName: 'Fetch aggregate', complexity: 25 },
    { activityName: `Update aggregate’s state`, complexity: 9 },
    { activityName: 'Save aggregate', complexity: 16 },
    { activityName: 'Dispatch events', complexity: 2 },
    { activityName: 'Route event', complexity: 2 },
    { activityName: 'Handle event (Update projection)', complexity: 25 },
    { activityName: 'Notify client', complexity: 2 }
  ],
  [
    { activityName: 'Create command', complexity: 2 },
    { activityName: 'Validate command', complexity: 8 },
    { activityName: 'Route command', complexity: 8 },
    { activityName: 'Fetch aggregate', complexity: 22 },
    { activityName: `Update aggregate’s state`, complexity: 8 },
    { activityName: 'Save aggregate', complexity: 7 },
    { activityName: 'Dispatch events', complexity: 6 },
    { activityName: 'Route event', complexity: 8 },
    { activityName: 'Handle event (Update projection)', complexity: 14 },
    { activityName: 'Notify client', complexity: 12 }
  ]
)

console.log('mCQRS')
calculateComplexity(
  [
    { activityName: 'Create command', complexity: 1 },
    { activityName: 'Validate command', complexity: 13.5 },
    { activityName: 'Route command', complexity: 2 },
    { activityName: 'Fetch aggregate', complexity: 18 },
    { activityName: `Update aggregate’s state`, complexity: 6 },
    { activityName: 'Apply events onto aggregate', complexity: 8 },
    { activityName: 'Save aggregate', complexity: 12 },
    { activityName: 'Dispatch events', complexity: 2 },
    { activityName: 'Route event', complexity: 2 },
    { activityName: 'Handle event (Update projection)', complexity: 18 },
    { activityName: 'Notify client', complexity: 2 }
  ],
  [
    { activityName: 'Create command', complexity: 2 },
    { activityName: 'Validate command', complexity: 8 },
    { activityName: 'Route command', complexity: 8 },
    { activityName: 'Fetch aggregate', complexity: 8 },
    { activityName: `Update aggregate’s state`, complexity: 8 },
    { activityName: 'Apply events onto aggregate', complexity: 3 },
    { activityName: 'Save aggregate', complexity: 8 },
    { activityName: 'Dispatch events', complexity: 6 },
    { activityName: 'Route event', complexity: 8 },
    { activityName: 'Handle event (Update projection)', complexity: 10 },
    { activityName: 'Notify client', complexity: 12 }
  ]
)

console.log('\n\n Query')
console.log('Classical CQRS')
calculateComplexity(
  [
    { activityName: 'Create query', complexity: 1 },
    { activityName: 'Validate query', complexity: 13.5 },
    { activityName: 'Fetch projection from DB', complexity: 25 },
    { activityName: 'Map projection to DTO', complexity: 2 },
    { activityName: `Return DTO`, complexity: 2 }
  ],
  [
    { activityName: 'Create query', complexity: 2 },
    { activityName: 'Validate query', complexity: 8 },
    { activityName: 'Fetch projection from DB', complexity: 4 },
    { activityName: 'Map projection to DTO', complexity: 2 },
    { activityName: `Return DTO`, complexity: 2 }
  ]
)

console.log('mCQRS')
calculateComplexity(
  [
    { activityName: 'Create query', complexity: 1 },
    { activityName: 'Validate query', complexity: 13.5 },
    { activityName: 'Fetch projection from DB', complexity: 18 },
    { activityName: 'Map projection to DTO', complexity: 2 },
    { activityName: `Return DTO`, complexity: 2 }
  ],
  [
    { activityName: 'Create query', complexity: 2 },
    { activityName: 'Validate query', complexity: 8 },
    { activityName: 'Fetch projection from DB', complexity: 4 },
    { activityName: 'Map projection to DTO', complexity: 2 },
    { activityName: `Return DTO`, complexity: 2 }
  ]
)

// ========== Modification =========

console.log('\n Modification')
console.log('\n Command')
console.log('Classical CQRS')
calculateComplexity(
  [
    { activityName: 'Create command', complexity: 1 },
    { activityName: 'Validate command', complexity: 13.5 },
    { activityName: 'Route command', complexity: 2 },
    { activityName: 'Fetch aggregate', complexity: 25 },
    { activityName: `Update aggregate’s state`, complexity: 9 },
    { activityName: 'Save aggregate', complexity: 16 },
    { activityName: 'Route event', complexity: 2 },
    { activityName: 'Handle event (Update projection)', complexity: 25 },
    { activityName: 'Notify client', complexity: 2 }
  ],
  [
    { activityName: 'Create command', complexity: 2 },
    { activityName: 'Validate command', complexity: 2 },
    { activityName: 'Route command', complexity: 4 },
    { activityName: 'Fetch aggregate', complexity: 8 },
    { activityName: `Update aggregate’s state`, complexity: 4 },
    { activityName: 'Save aggregate', complexity: 1 },
    { activityName: 'Route event', complexity: 4 },
    { activityName: 'Handle event (Update projection)', complexity: 6 },
    { activityName: 'Notify client', complexity: 2 }
  ]
)

console.log('mCQRS')
calculateComplexity(
  [
    { activityName: 'Create command', complexity: 1 },
    { activityName: 'Validate command', complexity: 13.5 },
    { activityName: 'Route command', complexity: 2 },
    { activityName: 'Fetch aggregate', complexity: 18 },
    { activityName: `Update aggregate’s state`, complexity: 6 },
    { activityName: 'Route event', complexity: 2 },
    { activityName: 'Handle event (Update projection)', complexity: 18 },
    { activityName: 'Notify client', complexity: 2 }
  ],
  [
    { activityName: 'Create command', complexity: 2 },
    { activityName: 'Validate command', complexity: 2 },
    { activityName: 'Route command', complexity: 4 },
    { activityName: 'Fetch aggregate', complexity: 4 },
    { activityName: `Update aggregate’s state`, complexity: 4 },
    { activityName: 'Route event', complexity: 4 },
    { activityName: 'Handle event (Update projection)', complexity: 2 },
    { activityName: 'Notify client', complexity: 2 }
  ]
)

console.log('\n\n Query')
console.log('Classical CQRS')
calculateComplexity(
  [
    { activityName: 'Create query', complexity: 1 },
    { activityName: 'Validate query', complexity: 13.5 },
    { activityName: 'Fetch projection from DB', complexity: 25 },
    { activityName: 'Map projection to DTO', complexity: 2 }
  ],
  [
    { activityName: 'Create query', complexity: 2 },
    { activityName: 'Validate query', complexity: 2 },
    { activityName: 'Fetch projection from DB', complexity: 4 },
    { activityName: 'Map projection to DTO', complexity: 2 }
  ]
)

console.log('mCQRS')
calculateComplexity(
  [
    { activityName: 'Create query', complexity: 1 },
    { activityName: 'Validate query', complexity: 13.5 },
    { activityName: 'Fetch projection from DB', complexity: 18 },
    { activityName: 'Map projection to DTO', complexity: 2 }
  ],
  [
    { activityName: 'Create query', complexity: 2 },
    { activityName: 'Validate query', complexity: 2 },
    { activityName: 'Fetch projection from DB', complexity: 4 },
    { activityName: 'Map projection to DTO', complexity: 2 }
  ]
)

const calculateMigrationComplexity = (cyclomaticSource, cognitiveSource) => {
  cyclomaticSource.map((m) => getClassValue(m.complexity, 69.5))

  const cyclomatic = cyclomaticSource.map((m) => ({
    ...m,
    complexity: getClassValue(m.complexity, 69.5)
  }))
  console.log(cyclomatic)

  const cognitive = cognitiveSource.map((m) => ({
    ...m,
    complexity: getClassValue(m.complexity, 39)
  }))
  console.log(cognitive)
}

console.log('Migration')
calculateMigrationComplexity(
  [
    { activityName: 'Pure CQRS to Classical CQRS', complexity: 65.5 },
    { activityName: 'Pure CQRS to mCQRS', complexity: 55.5 },
    { activityName: 'Classical CQRS to mCQRS', complexity: 55.5 },
    { activityName: 'mCQRS to Classical CQRS', complexity: 69.5 }
  ],
  [
    { activityName: 'Pure CQRS to Classical CQRS', complexity: 12 },
    { activityName: 'Pure CQRS to mCQRS', complexity: 26 },
    { activityName: 'Classical CQRS to mCQRS', complexity: 28 },
    { activityName: 'mCQRS to Classical CQRS', complexity: 39 }
  ]
)