const sas = [
  {
    name: 'SAAM',
    saDefinition: 'L',
    qualityAttributes: 'L',
    experienceRepository: 'N',
    benefits: 'M',
    involvedStakeholders: 'L',
    processSupport: 'L',
    socioTechnicalIssues: 'L',
    requiredResourcesTeam: 'L',
    requiredResourcesTime: 'M',
    methodActivities: 'M',
    toolSupport: 'L',
    maturityOfMethod: 'H',
    methodValidation: 'H'
  },
  {
    name: 'ATAM',
    saDefinition: 'L',
    qualityAttributes: 'H',
    experienceRepository: 'H',
    benefits: 'H',
    involvedStakeholders: 'L',
    processSupport: 'H',
    socioTechnicalIssues: 'M',
    requiredResourcesTeam: 'L',
    requiredResourcesTime: 'M',
    methodActivities: 'H',
    toolSupport: 'N',
    maturityOfMethod: 'M',
    methodValidation: 'H'
  },
  {
    name: 'ARID',
    saDefinition: 'L',
    qualityAttributes: 'L',
    experienceRepository: 'L',
    benefits: 'M',
    involvedStakeholders: 'M',
    processSupport: 'M',
    socioTechnicalIssues: 'M',
    requiredResourcesTeam: 'M',
    requiredResourcesTime: 'M',
    methodActivities: 'H',
    toolSupport: 'N',
    maturityOfMethod: 'M',
    methodValidation: 'N'
  },
  {
    name: 'AHP',
    saDefinition: 'N',
    qualityAttributes: 'H',
    experienceRepository: 'N',
    benefits: 'L',
    involvedStakeholders: 'M',
    processSupport: 'L',
    socioTechnicalIssues: 'N',
    requiredResourcesTeam: 'M',
    requiredResourcesTime: 'H',
    methodActivities: 'M',
    toolSupport: 'M',
    maturityOfMethod: 'H',
    methodValidation: 'H'
  },
  {
    name: 'SASDMIT',
    saDefinition: 'M',
    qualityAttributes: 'H',
    experienceRepository: 'H',
    benefits: 'H',
    involvedStakeholders: 'H',
    processSupport: 'H',
    socioTechnicalIssues: 'L',
    requiredResourcesTeam: 'H',
    requiredResourcesTime: 'L',
    methodActivities: 'H',
    toolSupport: 'M',
    maturityOfMethod: 'L',
    methodValidation: 'L'
  }
]

const projectDBBS = {
  name: 'DBBS Project',
  saDefinition: 'L',
  qualityAttributes: 'H',
  experienceRepository: 'H',
  benefits: 'H',
  involvedStakeholders: 'H',
  processSupport: 'M',
  socioTechnicalIssues: 'L',
  requiredResourcesTeam: 'H',
  requiredResourcesTime: 'M',
  methodActivities: 'H',
  toolSupport: 'M',
  maturityOfMethod: 'M',
  methodValidation: 'M'
}

const projectTypical = {
  name: 'Typical Project',
  saDefinition: 'M',
  qualityAttributes: 'M',
  experienceRepository: 'M',
  benefits: 'H',
  involvedStakeholders: 'M',
  processSupport: 'H',
  socioTechnicalIssues: 'M',
  requiredResourcesTeam: 'M',
  requiredResourcesTime: 'H',
  methodActivities: 'M',
  toolSupport: 'H',
  maturityOfMethod: 'H',
  methodValidation: 'H'
}

const projectLowReq = {
  name: 'Low Requirements Project',
  saDefinition: 'L',
  qualityAttributes: 'L',
  experienceRepository: 'N',
  benefits: 'M',
  involvedStakeholders: 'H',
  processSupport: 'M',
  socioTechnicalIssues: 'L',
  requiredResourcesTeam: 'M',
  requiredResourcesTime: 'M',
  methodActivities: 'M',
  toolSupport: 'L',
  maturityOfMethod: 'L',
  methodValidation: 'L'
}

const values = {
  N: 0,
  L: 1,
  M: 2,
  H: 3
}

const compare = (sa, proj) => {
  const apr = Object.keys(sa).reduce((agg, k) => {
    if (k === 'name') return agg

    const qSA = values[sa[k]]
    const qProj = values[proj[k]]
    return agg + (qSA < qProj ? 0 : qProj)
  }, 0)

  const total = Object.keys(sa).reduce((agg, k) => {
    if (k === 'name') return agg

    const qSA = values[sa[k]]
    const qProj = values[proj[k]]
    return agg + (qSA < qProj ? qProj - qSA : qSA)
  }, 0)

  return Math.round((apr / total) * 100) / 100
}

console.log(`Name      |${projectDBBS.name.padEnd(20)}|${projectTypical.name.padEnd(20)}|${projectLowReq.name.padEnd(20)}`)
console.log('----------|--------------------|--------------------|--------------------')
for (let i = 0; i < sas.length; i += 1) {
  console.log(
    `${sas[i].name.padEnd(10)}|${compare(sas[i], projectDBBS).toString().padEnd(20)}|${compare(sas[i], projectTypical).toString().padEnd(20)}|${compare(sas[i], projectLowReq).toString().padEnd(20)}`
  )
}
