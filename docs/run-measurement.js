/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-await-in-loop */
const axios = require('axios')

const BASE_URL = 'http://localhost:8000' // 'http://m-sqrs.eba-intpqewv.eu-central-1.elasticbeanstalk.com'

/**
 * Calculates the average of an array of numbers.
 *
 * @param {number[]} arr The array of numbers.
 * @returns {number} The average of the numbers.
 */
function calculateAverage(arr) {
  if (arr.length === 0) {
    return 0
  }
  const sum = arr.reduce((acc, val) => acc + val, 0)
  return sum / arr.length
}

async function testCreateEndpoint() {
  try {
    const url = `${BASE_URL}/users/create-user`
    const numRequests = 1000
    const responseTimes = []

    for (let i = 0; i < numRequests; i += 1) {
      const startTime = Date.now()
      try {
        const response = await axios.post(url, { name: `Test updated ${i}` })
        const endTime = Date.now()
        const responseTime = endTime - startTime
        responseTimes.push(responseTime)

        console.log(`Request ${i + 1}:`)
        console.log(`  Status: ${response.status}`)
        console.log(`  Response Time: ${responseTime}ms`)
        console.log(`  Response Body: ${JSON.stringify(response.data)}`) // Log the response body
        await new Promise((res) => {
          setTimeout(() => res(), 100)
        })
      } catch (error) {
        const endTime = Date.now()
        const responseTime = endTime - startTime
        responseTimes.push(responseTime)
        console.error(`Request ${i + 1} failed: ${error}`)
      }
    }

    const averageResponseTime = calculateAverage(responseTimes)
    console.log(`\nAverage response time: ${averageResponseTime.toFixed(2)} ms`)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

const mIDs = [
  'a7878ebb-47b4-4e71-bd51-dd370080831d',
  '2f71d263-3849-4349-bfbe-4d09cec8e22f',
  '3ba72c60-fc33-43d7-ad21-e1b3f60d843a',
  '908f02f9-de09-43ef-863b-4f94e14a31f3',
  '50b6a4f7-a26a-4942-833d-794e72be8fb4',
  '0d27607e-b1eb-4bc8-baab-8e83f186f7ce',
  '36cb40be-d1ca-4dbc-83b1-a4b93ecf577e',
  'e2c5420e-4c1f-45b3-abb6-9dd50b51bf24',
  '76843619-6eee-4849-9b5b-f630a772610e',
  'e71507cd-c5fd-4900-b2e9-24f23f8ed694',
  '6ece520e-d5ca-469b-ace0-cea2401e55e8',
  '084ad5cc-72ea-4c36-83c7-01fd11ea01bf',
  'cfb85e21-b0de-4bc4-9041-bc1f93ed9d96',
  'bc52ccaf-203c-4f93-b9a0-f0b44f0ab163',
  '3b6b1d18-0039-4405-aea5-74ee690b09cf',
  '41d05689-4882-4334-a7ad-343a0c5c9224',
  '0663b8d8-69f7-44be-8cdb-159fe65012f0',
  'c062cc82-f4cc-4d46-ae78-f9d0c644c513',
  '405f318d-928f-4af4-8593-21b5be748e9f',
  'b3636896-ecb3-45e7-875d-9b48c246ced3',
  'c3184df4-c0e3-40a1-96f7-116fed027eb3',
  '4648ecd6-7108-45c8-8397-938ad3c04d18',
  'afa07956-0beb-4f59-9d9a-c4a118894d9a',
  '34080b5b-e59d-48a4-9d8b-c4a9769c1465',
  '3e06dc1e-22ea-4a93-91bb-effb3dcf4598',
  'f2155602-831a-4c0e-a5cf-1371effe20db',
  'fee10f03-2bd0-4481-accf-d89204517f29',
  '7963005a-15ec-471f-9a30-7251b5717174',
  '5979a611-bd7d-48d5-8a43-8e1f00f77ab9',
  '7a18e3f0-56ab-4351-a82c-e2fbbfe45bdd',
  '06ff7417-c429-4a18-814c-04465b2f0a0f'
]

const classicalIDs = [
  'a86c31af-c50e-4778-ba04-1d799de602df',
  '8ea640c1-cb7e-4553-b013-125e3d92d5ee',
  '3d4dc6ff-62f8-4084-92e1-447e99302aaa',
  '9bf0ce6d-4b1b-47e6-a92a-cc58aa9f32cf',
  '6c04831b-21dc-4a77-a5e5-4069e7cc3688',
  '50b44683-7fba-49df-bef4-1670e0c30497',
  '040323b1-e650-47ad-a1aa-312869cb8440',
  'e0b1ad72-3fb8-4ea7-a693-95cf60069136',
  '9c0092a5-7d72-43b8-8c07-3495794d6f8f',
  'ed4ebd3f-8113-4536-b23b-8835c48e2364',
  '2e03a51c-560d-4e7b-b5f6-4520aed59b57',
  'a6c83c80-e029-4bdd-990d-7adee369ca78',
  'b27e2d69-3fd3-4318-908e-210d9b4f05a0',
  'ef687d83-c0c6-4294-8244-47a101c4f297',
  'f791a177-69d4-443f-beeb-5097ee3537ff',
  'da440fd5-14e5-4a9a-9cf0-4fbfdf180931',
  '4f213b5c-98a8-4d08-9ac7-f4639e81746a',
  '815ea185-0043-457c-8a21-735fb419a63d',
  '0e4d67f7-c048-4411-9ae8-b7f3993b4412',
  'c317d95f-8fcf-4855-a6ba-0c517ed0a84b',
  '4bf15ea6-7c5c-4f55-a97c-75ac09699388',
  '8e6051ab-4341-4552-91e8-81d6e472041a',
  'b50a2d3e-c13a-45bb-839b-e0a5565e4c44',
  'e1643083-030a-4959-80ff-4c3be93065b5',
  '417c64be-da60-43ce-92dd-2c17e5529adc',
  'd3869a64-d62c-470a-96b5-1760e0cb619e',
  'd2672e34-1fc1-4d08-9593-7664f0d48652',
  '71c888cb-1b42-4adb-8793-14a482a0071c',
  'bacbd3e9-a9f4-44de-b087-66cd082ca4e6',
  'fb269fef-a5eb-4baf-a573-0398b5a9e0dd'
]

async function testUpdateEndpoint() {
  try {
    const url = `${BASE_URL}/users/update-user-name`
    const responseTimes = []

    const ids = classicalIDs

    for (let j = 0; j < 33; j += 1) {
      for (let i = 0; i < ids.length; i += 1) {
        const startTime = Date.now()
        try {
          const response = await axios.post(url, { id: ids[i], name: `Test updated ${j}${i}` })
          const endTime = Date.now()
          const responseTime = endTime - startTime
          responseTimes.push(responseTime)

          console.log(`Request ${(j + 1) * (i + 1)}:`)
          console.log(`  Status: ${response.status}`)
          console.log(`  Response Time: ${responseTime}ms`)
          console.log(`  Response Body: ${JSON.stringify(response.data)}`) // Log the response body
          // await new Promise((res) => {
          //   setTimeout(() => res(), 100)
          // })
        } catch (error) {
          const endTime = Date.now()
          const responseTime = endTime - startTime
          responseTimes.push(responseTime)
          console.error(`Request ${i + 1} failed: ${error}`)
        }
      }
    }

    const averageResponseTime = calculateAverage(responseTimes)
    console.log(`\nAverage response time: ${averageResponseTime.toFixed(2)} ms`)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

async function testFetchEndpoint() {
  try {
    const url = `${BASE_URL}/users/main/`
    const responseTimes = []

    const ids = mIDs

    for (let j = 0; j < 33; j += 1) {
      for (let i = 0; i < ids.length; i += 1) {
        const startTime = Date.now()
        try {
          const response = await axios.get(url + ids[i])
          const endTime = Date.now()
          const responseTime = endTime - startTime
          responseTimes.push(responseTime)

          console.log(`Request ${(j + 1) * (i + 1)}:`)
          console.log(`  Status: ${response.status}`)
          console.log(`  Response Time: ${responseTime}ms`)
          console.log(`  Response Body: ${JSON.stringify(response.data)}`) // Log the response body
          // await new Promise((res) => {
          //   setTimeout(() => res(), 100)
          // })
        } catch (error) {
          const endTime = Date.now()
          const responseTime = endTime - startTime
          responseTimes.push(responseTime)
          console.error(`Request ${i + 1} failed: ${error}`)
        }
      }
    }

    const averageResponseTime = calculateAverage(responseTimes)
    console.log(`\nAverage response time: ${averageResponseTime.toFixed(2)} ms`)
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

testCreateEndpoint()
// testUpdateEndpoint()
// testFetchEndpoint()
