const commands = 20
const queries = 10
const projections = 8
const additionNew = 0.5
const modificationOld = 0.5

const classicalCQRS = {
  read: 118,
  write: 461,
  commandImplementation: 95,
  commandModification: 32,
  queryImplementation: 18,
  queryModification: 10,
  projectionImplementation: 36,
  projectionModification: 10,
}

const mCQRS = {
  read: 115,
  write: 1063,
  commandImplementation: 81,
  commandModification: 23,
  queryImplementation: 18,
  queryModification: 10,
  projectionImplementation: 20,
  projectionModification: 6,
}

const classicalCQRSNorm = Object.keys(classicalCQRS).reduce((agg, key) => ({
  ...agg, [key]: classicalCQRS[key] / (classicalCQRS[key] + mCQRS[key]),
}), {})

const mCQRSNorm = Object.keys(classicalCQRS).reduce((agg, key) => ({
  ...agg, [key]: mCQRS[key] / (classicalCQRS[key] + mCQRS[key]),
}), {})

Object.keys(classicalCQRS).forEach(key => {
  if (mCQRSNorm[key] + classicalCQRSNorm[key] !== 1) {
    console.warn('Normalization failed', key)
  }
})

const isComplexity = {
  commandImplementation: commands + additionNew * commands,
  commandModification: modificationOld * commands,
  queryImplementation: queries + additionNew * queries,
  queryModification: modificationOld * queries,
  projectionImplementation: projections + additionNew * projections,
  projectionModification: modificationOld * projections,
}

const isTotalComplexity = Object.values(isComplexity).reduce((sum, value) => sum + value, 0)

const isComplexityNorm = Object.keys(isComplexity).reduce((agg, key) => ({
  ...agg, [key]: isComplexity[key] / isTotalComplexity
}), {})

if (Object.values(isComplexityNorm).reduce((sum, value) => sum + value, 0) !== 1) {
  console.warn('Normalization failed isComplexityNorm')
}

const matrix = Array.from(Array(100), () => new Array(100));

let min = 100
let max = 0
let count50 = 0
let countmCQRS = 0
let countCQRS = 0

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const perfCoef = 0.01 * i
    const complCoef = 1 - perfCoef
    const readPer = 0.01 * j
    const writePer = 1 - readPer

    const isCase = Object.keys(isComplexityNorm).reduce((agg, key) => ({
      ...agg, [key]: isComplexityNorm[key] * complCoef
    }), {
      read: readPer * perfCoef,
      write: writePer * perfCoef,
    })

    const classicalCQRSApplication = Object.keys(isCase).reduce((agg, key) => ({
      ...agg, [key]: classicalCQRSNorm[key] * isCase[key]
    }), {})

    const mCQRSApplication = Object.keys(isCase).reduce((agg, key) => ({
      ...agg, [key]: mCQRSNorm[key] * isCase[key]
    }), {})

    const classicalCQRSResult = Math.round((1 - Object.values(classicalCQRSApplication).reduce((sum, value) => sum + value, 0)) * 100)
    const mCQRSResult = Math.round((1 - Object.values(mCQRSApplication).reduce((sum, value) => sum + value, 0)) * 100)

    if (mCQRSResult + classicalCQRSResult !== 100) {
      console.warn('Normalization failed result', mCQRSResult + classicalCQRSResult)
    }

    matrix[i][j] = mCQRSResult
    if (mCQRSResult > max) max = mCQRSResult
    if (mCQRSResult < min) min = mCQRSResult
    if (mCQRSResult === 50) count50++
    if (mCQRSResult > 50) countmCQRS++
    if (mCQRSResult < 50) countCQRS++
  }
}

console.log(count50, countmCQRS, countCQRS)
