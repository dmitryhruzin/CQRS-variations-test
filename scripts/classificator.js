const classes = [
  { name: 'very simple', value: 2 },
  { name: 'simple', value: 4 },
  { name: 'average', value: 6 },
  { name: 'complex', value: 8 },
  { name: 'very complex', value: 12 }
]

const cyclomaticMaxValue = 25
const cognitiveMaxValue = 22

const getClassValue = (value, xAxis) => {
  const chunksCount = classes.length * 2 - 1
  const chunk = xAxis / chunksCount

  for (let i = 0; i < chunksCount; i += 1) {
    if (value <= chunk * (i + 1)) {
      if (i % 2) {
        const percentOfRightClass = Math.round(((value - chunk * i) * 100) / chunk)
        const percentOfLeftClass = 100 - percentOfRightClass
        return [
          { part: percentOfLeftClass, class: classes[Math.round(i / 2) - 1] },
          { part: percentOfRightClass, class: classes[Math.round(i / 2)] }
        ].filter((c) => c.part)
      }
      return [{ part: 100, class: classes[i / 2] }]
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
    complexity: getClassValue(m.complexity, cyclomaticMaxValue).reduce((res, c) => res + c.class.value * c.part, 0) / 100
  }))
  const cyclomaticTotal = cyclomatic.reduce((res, m) => res + m.complexity, 0).toFixed(2)

  console.log('By activities', cyclomatic)
  console.log('Total', cyclomaticTotal)

  console.log('\n Cognitive functional complexity')

  const сognitive = cognitiveSource.map((m) => ({
    ...m,
    complexity: getClassValue(m.complexity, cognitiveMaxValue).reduce((res, c) => res + c.class.value * c.part, 0) / 100
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
    { activityName: `Return DTO`, complexity: 13.5 }
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
    { activityName: `Return DTO`, complexity: 13.5 }
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
