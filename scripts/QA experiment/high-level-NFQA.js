// Project metsa parameters
const commands = 41
const queries = 19

const isComplexity = {
  complexity: commands + queries
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
  performance: 132,
  complexity: 95 + 18
}

const mCQRS = {
  performance: 210,
  complexity: 81 + 18
}

const classicalCQRSNorm = Object.keys(classicalCQRS).reduce(
  (agg, key) => ({
    ...agg,
    [key]: 1 / classicalCQRS[key] / (1 / classicalCQRS[key] + 1 / mCQRS[key])
  }),
  {}
)

console.log('classicalCQRSNorm', classicalCQRSNorm)

const mCQRSNorm = Object.keys(classicalCQRS).reduce(
  (agg, key) => ({
    ...agg,
    [key]: 1 / mCQRS[key] / (1 / classicalCQRS[key] + 1 / mCQRS[key])
  }),
  {}
)

console.log('mCQRSNorm', mCQRSNorm)

Object.keys(classicalCQRS).forEach((key) => {
  if (mCQRSNorm[key] + classicalCQRSNorm[key] !== 1) {
    console.warn('Normalization failed', key)
  }
})

const calculateApplicability = (perfCoef) => {
  const complCoef = 1 - perfCoef

  const isCase = Object.keys(isComplexityNorm).reduce(
    (agg, key) => ({
      ...agg,
      [key]: isComplexityNorm[key] * complCoef
    }),
    {
      performance: perfCoef
    }
  )

  console.log('classicalCQRSNorm', classicalCQRSNorm)
  console.log('mCQRSNorm', mCQRSNorm)
  console.log('isCase', isCase)

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

  console.log('classicalCQRSApplication', classicalCQRSApplication)
  console.log('mCQRSApplication', mCQRSApplication)

  const classicalCQRSResult = Math.round(
    Object.values(classicalCQRSApplication).reduce((sum, value) => sum + value, 0) * 100
  )
  const mCQRSResult = Math.round(Object.values(mCQRSApplication).reduce((sum, value) => sum + value, 0) * 100)

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

console.log('Write 20, Read 80, Perf importance 0', calculateApplicability(0.2))
