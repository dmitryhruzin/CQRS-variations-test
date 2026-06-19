import DSAVCQRSES from './DSAV-CQRSES-v1.js'
import { minParams, avgParams, maxParams, classicalCQRS, mCQRS, mCQRSPlus } from './data.js'

const dsavMin = new DSAVCQRSES(minParams, classicalCQRS, mCQRS)
const dsavAvg = new DSAVCQRSES(avgParams, classicalCQRS, mCQRS)
const dsavMax = new DSAVCQRSES(maxParams, classicalCQRS, mCQRS)

const evaluationResultMin = dsavMin.calculateApplicability()
const evaluationResultAvg = dsavAvg.calculateApplicability()
const evaluationResultMax = dsavMax.calculateApplicability()
console.table({ evaluationResultMin, evaluationResultAvg, evaluationResultMax })
