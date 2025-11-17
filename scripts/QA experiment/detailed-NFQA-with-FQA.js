// Project metsa parameters
const commands = 41
const queries = 19
const mvpDevTimeSprints = 8
const assessmentPeriodSprints = 12
const expectedFrequencyChangeEventTypesPerSprint = 1
const expectedFrequencyDataRemovingPerSprint = 0.5
const additionNew = 0.2
const modificationOld = 0.8

const commandsPerSprint = commands / mvpDevTimeSprints
const queriesPerSprint = queries / mvpDevTimeSprints

const isComplexity = {
  commandDevelopment: commands + additionNew * commandsPerSprint * assessmentPeriodSprints,
  commandModification: modificationOld * commandsPerSprint * assessmentPeriodSprints,
  queryDevelopment: queries + additionNew * queriesPerSprint * assessmentPeriodSprints,
  queryModification: modificationOld * queriesPerSprint * assessmentPeriodSprints,
  changeEventTypes: (mvpDevTimeSprints + assessmentPeriodSprints) * expectedFrequencyChangeEventTypesPerSprint,
  dataRemoving: assessmentPeriodSprints * expectedFrequencyDataRemovingPerSprint
}

console.log('isComplexity', isComplexity)

const isTotalComplexity = Object.values(isComplexity).reduce((sum, value) => sum + value, 0)

const isComplexityNorm = Object.keys(isComplexity).reduce(
  (agg, key) => ({
    ...agg,
    [key]: isComplexity[key] / isTotalComplexity
  }),
  {}
)

if (Object.values(isComplexityNorm).reduce((sum, value) => sum + value, 0) !== 1) {
  console.warn('Normalization failed isComplexityNorm')
}

const classicalCQRS = {
  // Performance
  read: 5,
  write: 2.9,
  criticalWrite: 2.9,
  // Complexity
  commandDevelopment: 77.3,
  commandModification: 58.95,
  queryDevelopment: 29.91,
  queryModification: 24.64,
  changeEventTypes: 12,
  dataRemoving: 11
}

const mCQRS = {
  // Performance
  read: 5,
  write: 3.68,
  criticalWrite: 3.68,
  // Complexity
  commandDevelopment: 70.85,
  commandModification: 45.56,
  queryDevelopment: 27.91,
  queryModification: 22.64,
  changeEventTypes: 5,
  dataRemoving: 4
}

const classicalCQRSNorm = Object.keys(classicalCQRS).reduce(
  (agg, key) => ({
    ...agg,
    [key]: Math.round((1 / classicalCQRS[key] / (1 / classicalCQRS[key] + 1 / mCQRS[key])) * 1000) / 1000
  }),
  {}
)

const mCQRSNorm = Object.keys(classicalCQRS).reduce(
  (agg, key) => ({
    ...agg,
    [key]: Math.round((1 / mCQRS[key] / (1 / classicalCQRS[key] + 1 / mCQRS[key])) * 1000) / 1000
  }),
  {}
)

Object.keys(classicalCQRS).forEach((key) => {
  if (mCQRSNorm[key] + classicalCQRSNorm[key] !== 1) {
    console.warn('Normalization failed', key)
  }
})

console.log('classicalCQRSNorm', classicalCQRSNorm)
console.log('mCQRSNorm', mCQRSNorm)

const isPerformanceNorm = {
  read: 0.8,
  write: 0.1,
  criticalWrite: 0.1
}

const calculateApplicability = (perfCoef, complCoef) => {
  const isCaseComplexity = Object.keys(isComplexityNorm).reduce(
    (agg, key) => ({
      ...agg,
      [key]: Math.round(isComplexityNorm[key] * complCoef * 1000) / 1000
    }),
    {}
  )

  const isCasePerformance = Object.keys(isPerformanceNorm).reduce(
    (agg, key) => ({
      ...agg,
      [key]: Math.round(isPerformanceNorm[key] * perfCoef * 1000) / 1000
    }),
    {}
  )

  const isCase = { ...isCaseComplexity, ...isCasePerformance }
  console.log('isCase', isCase)

  const classicalCQRSApplication = Object.keys(isCase).reduce(
    (agg, key) => ({
      ...agg,
      [key]: Math.round(classicalCQRSNorm[key] * isCase[key] * 1000) / 1000
    }),
    {}
  )

  const mCQRSApplication = Object.keys(isCase).reduce(
    (agg, key) => ({
      ...agg,
      [key]: Math.round(mCQRSNorm[key] * isCase[key] * 1000) / 1000
    }),
    {}
  )

  console.log('classicalCQRSApplication', classicalCQRSApplication)
  console.log('mCQRSApplication', mCQRSApplication)

  const classicalCQRSResult =
    Math.round(Object.values(classicalCQRSApplication).reduce((sum, value) => sum + value, 0) * 1000) / 10
  const mCQRSResult = Math.round(Object.values(mCQRSApplication).reduce((sum, value) => sum + value, 0) * 1000) / 10

  if (mCQRSResult + classicalCQRSResult !== 100) {
    console.warn('Normalization failed result', mCQRSResult + classicalCQRSResult)
  }

  return { mCQRSResult, classicalCQRSResult }
}

// const matrix = Array.from(Array(100), () => new Array(100))

// let mCQRSSuggestions = 0
// let classicalCQRSSuggestions = 0
// let equalSuggestions = 0
// let min = 100
// let max = 0

// for (let i = 0; i < 100; i += 1) {
//   for (let j = 0; j < 100; j += 1) {
//     const perfCoef = 0.01 * (i + 1)
//     const readPer = 0.01 * (j + 1)

//     const { mCQRSResult, classicalCQRSResult } = calculateApplicability(perfCoef, readPer)

//     matrix[i][j] = mCQRSResult
//     if (mCQRSResult > max) max = mCQRSResult
//     if (mCQRSResult < min) min = mCQRSResult
//     if (mCQRSResult === 50) equalSuggestions += 1
//     if (mCQRSResult > 50) mCQRSSuggestions += 1
//     if (classicalCQRSResult > 50) classicalCQRSSuggestions += 1
//   }
// }

// console.table([
//   { Metric: 'min', Value: min },
//   { Metric: 'max', Value: max },
//   { Metric: 'mCQRSSuggestions', Value: mCQRSSuggestions },
//   { Metric: 'classicalCQRSSuggestions', Value: classicalCQRSSuggestions },
//   { Metric: 'Equal', Value: equalSuggestions }
// ])

console.log('Write 20, Read 80, Perf importance 0', calculateApplicability(0.2, 0.8))
