// Project metsa parameters
const commands = 41
const queries = 19
const additionNew = 0.2
const modificationOld = 0.8

const isComplexity = {
  commandDevelopment: commands + additionNew * commands,
  commandModification: modificationOld * commands,
  queryDevelopment: queries + additionNew * queries,
  queryModification: modificationOld * queries
}

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
  read: 5,
  write: 2.9,
  commandDevelopment: 77.3,
  commandModification: 58.95,
  queryDevelopment: 29.91,
  queryModification: 24.64
}

const mCQRS = {
  read: 5,
  write: 3.68,
  commandDevelopment: 70.85,
  commandModification: 45.56,
  queryDevelopment: 27.91,
  queryModification: 22.64
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

console.log('classicalCQRSNorm', classicalCQRSNorm)
console.log('mCQRSNorm', mCQRSNorm)

Object.keys(classicalCQRS).forEach((key) => {
  if (mCQRSNorm[key] + classicalCQRSNorm[key] !== 1) {
    console.warn('Normalization failed', key)
  }
})

const calculateApplicability = (perfCoef, readPer) => {
  const complCoef = 1 - perfCoef
  const writePer = 1 - readPer

  const isCase = Object.keys(isComplexityNorm).reduce(
    (agg, key) => ({
      ...agg,
      [key]: Math.round(isComplexityNorm[key] * complCoef * 1000) / 1000
    }),
    {
      read: Math.round(readPer * perfCoef * 1000) / 1000,
      write: Math.round(writePer * perfCoef * 1000) / 1000
    }
  )

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

  const classicalCQRSResult = Object.values(classicalCQRSApplication).reduce((sum, value) => sum + value, 0) * 100
  const mCQRSResult = Object.values(mCQRSApplication).reduce((sum, value) => sum + value, 0) * 100

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
