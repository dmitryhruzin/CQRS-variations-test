// import DSAVCQRSES from './DSAV-CQRSES-v1.js'
// import { minParams, avgParams, maxParams, expParams, classicalCQRS, mCQRS, mCQRSPlus } from './data.js'

// const dsavMin = new DSAVCQRSES(minParams, classicalCQRS, mCQRS)
// const dsavAvg = new DSAVCQRSES(avgParams, classicalCQRS, mCQRS)
// const dsavMax = new DSAVCQRSES(maxParams, classicalCQRS, mCQRS)

// const evaluationResultMin = dsavMin.calculateApplicability()
// const evaluationResultAvg = dsavAvg.calculateApplicability()
// const evaluationResultMax = dsavMax.calculateApplicability()
// console.table({ evaluationResultMin, evaluationResultAvg, evaluationResultMax })

import DSAVCQRSES from './DSAV-CQRSES-v1.js'
import { minParams, maxParams, classicalCQRS, mCQRS } from './data.js'

const STEPS = 11 // 0%, 10%, ..., 100%

// Linear interpolation of every numeric parameter between minParams and maxParams
const interpolateParams = (t) =>
  Object.fromEntries(Object.keys(minParams).map((key) => [key, minParams[key] + (maxParams[key] - minParams[key]) * t]))

const results = {}
Array.from({ length: STEPS }, (_, i) => i / (STEPS - 1)).forEach((t) => {
  const params = interpolateParams(t)
  const dsav = new DSAVCQRSES(params, classicalCQRS, mCQRS)
  const complexity = dsav.calculateApplicability()
  results[`${Math.round(t * 100)}%`] = {
    ...complexity,
    ratio: Math.round((complexity.classicalCQRSResult / complexity.mCQRSResult) * 1000) / 1000
  }
})

console.table(results)
