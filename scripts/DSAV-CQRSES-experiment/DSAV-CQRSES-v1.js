// Project metsa parameters
const create = 10
const update = 35
const eventualConsistency = 52
const queries = 29
const projections = 22

const expectedFrequencyChangeEventTypesPerSprint = 3
const expectedFrequencyDataRemovingPerSprint = 0.66

const mvpDevTimeSprints = 8
const assessmentPeriodSprints = 12

// const additionNew = 0.2
const modificationOld = 0.8

// const createPerSprint = create / mvpDevTimeSprints
// const updatePerSprint = update / mvpDevTimeSprints
// const eventualConsistencyPerSprint = eventualConsistency / mvpDevTimeSprints
// const queriesPerSprint = queries / mvpDevTimeSprints
// const projectionsPerSprint = projections / mvpDevTimeSprints

// const addCoef = additionNew * assessmentPeriodSprints
// const modCoef = modificationOld * assessmentPeriodSprints

const isComplexity = {
  // createDevelopment: create + createPerSprint * addCoef,
  // createModification: modCoef * createPerSprint,
  // updateDevelopment: update + updatePerSprint * addCoef,
  // updateModification: modCoef * updatePerSprint,
  // eventualConsistencyDevelopment: eventualConsistency + eventualConsistencyPerSprint * addCoef,
  // eventualConsistencyModification: modCoef * eventualConsistencyPerSprint,
  // queryDevelopment: queries + queriesPerSprint * addCoef,
  // queryModification: modCoef * queriesPerSprint,
  // projectionRebuildDevelopment: projections + projectionsPerSprint * addCoef,
  // projectionRebuildModification: modCoef * projectionsPerSprint,

  changeEventTypes: (mvpDevTimeSprints + assessmentPeriodSprints) * expectedFrequencyChangeEventTypesPerSprint,
  dataRemoving: assessmentPeriodSprints * expectedFrequencyDataRemovingPerSprint,

  createDevelopment: create,
  createModification: create * modificationOld,
  updateDevelopment: update,
  updateModification: update * modificationOld,
  eventualConsistencyDevelopment: eventualConsistency,
  eventualConsistencyModification: eventualConsistency * modificationOld,
  queryDevelopment: queries,
  queryModification: queries * modificationOld,
  projectionRebuildDevelopment: projections,
  projectionRebuildModification: projections * modificationOld
}

// console.log('isComplexity')
// console.table(Object.entries(isComplexity).reduce((acc, [key, value]) => ({ ...acc, [key]: value.toFixed(2) }), {}))

const isTotalComplexity = Object.values(isComplexity).reduce((sum, value) => sum + value, 0)

const isComplexityNorm = Object.keys(isComplexity).reduce(
  (agg, key) => ({
    ...agg,
    [key]: isComplexity[key] / isTotalComplexity
  }),
  {}
)

if (Math.abs(Object.values(isComplexityNorm).reduce((sum, value) => sum + value, 0) - 1) > 0.0001) {
  console.warn('Normalization failed isComplexityNorm')
}

const classicalCQRS = {
  // Performance
  read: 5,
  write: 2.93,
  // Complexity
  createDevelopment: 27.68,
  createModification: 26.18,
  updateDevelopment: 42.04,
  updateModification: 33.54,
  eventualConsistencyDevelopment: 20.26,
  eventualConsistencyModification: 14.5,
  queryDevelopment: 18,
  queryModification: 17.5,
  projectionRebuildDevelopment: 38.83,
  projectionRebuildModification: 33.33,
  changeEventTypes: 12,
  dataRemoving: 11
}

const mCQRS = {
  // Performance
  read: 5,
  write: 3.68,
  // Complexity
  createDevelopment: 27.35,
  createModification: 25.1,
  updateDevelopment: 34,
  updateModification: 30.5,
  eventualConsistencyDevelopment: 15.5,
  eventualConsistencyModification: 13.5,
  queryDevelopment: 17.8,
  queryModification: 17.3,
  projectionRebuildDevelopment: 28.69,
  projectionRebuildModification: 26.69,
  changeEventTypes: 5,
  dataRemoving: 4
}

const classicalCQRSNorm = Object.keys(classicalCQRS).reduce(
  (agg, key) => ({
    ...agg,
    [key]: 1 / classicalCQRS[key] / (1 / classicalCQRS[key] + 1 / mCQRS[key])
  }),
  {}
)

const mCQRSNorm = Object.keys(classicalCQRS).reduce(
  (agg, key) => ({
    ...agg,
    [key]: 1 / mCQRS[key] / (1 / classicalCQRS[key] + 1 / mCQRS[key])
  }),
  {}
)

Object.keys(classicalCQRS).forEach((key) => {
  if (Math.abs(mCQRSNorm[key] + classicalCQRSNorm[key] - 1) > 0.0001) {
    console.warn('Normalization failed', key)
  }
})

// const combinedCQRSNorm = Object.keys(classicalCQRS).reduce(
//   (acc, key) => ({
//     ...acc,
//     [key]: { classicalCQRS: classicalCQRSNorm[key].toFixed(4), mCQRS: mCQRSNorm[key].toFixed(4) }
//   }),
//   {}
// )
// console.table(combinedCQRSNorm)

const isPerformanceNorm = {
  read: 0.8,
  write: 0.2
}

const calculateApplicability = (perfCoef, complCoef) => {
  const isCaseComplexity = Object.keys(isComplexityNorm).reduce(
    (agg, key) => ({
      ...agg,
      [key]: isComplexityNorm[key] * complCoef
    }),
    {}
  )

  const isCasePerformance = Object.keys(isPerformanceNorm).reduce(
    (agg, key) => ({
      ...agg,
      [key]: isPerformanceNorm[key] * perfCoef
    }),
    {}
  )

  const complexitySum = Object.values(isCaseComplexity).reduce((sum, value) => sum + value, 0)
  const performanceSum = Object.values(isCasePerformance).reduce((sum, value) => sum + value, 0)
  if (Math.abs(complexitySum + performanceSum - 1) > 0.001) {
    console.warn('Normalization failed isCase', complexitySum, performanceSum)
  }

  const isCase = { ...isCaseComplexity, ...isCasePerformance }
  // console.log('isCase')
  // console.table(Object.entries(isCase).reduce((acc, [key, value]) => ({ ...acc, [key]: value.toFixed(4) }), {}))

  const classicalCQRSApplication = Object.keys(isCase).reduce(
    (agg, key) => ({
      ...agg,
      [key]: classicalCQRSNorm[key] * isCase[key]
    }),
    {}
  )

  const mCQRSApplication = Object.keys(isCase).reduce(
    (agg, key) => ({
      ...agg,
      [key]: mCQRSNorm[key] * isCase[key]
    }),
    {}
  )

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

const evaluationResult = calculateApplicability(0.1, 0.9)
console.table(evaluationResult)

const complexityEvaluation = calculateApplicability(0, 1)
console.log(
  'Save',
  ((-complexityEvaluation.classicalCQRSResult * 100) / complexityEvaluation.mCQRSResult + 100).toFixed(2),
  '%'
)
