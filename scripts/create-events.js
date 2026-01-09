/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-await-in-loop */
const axios = require('axios')

const BASE_URL = 'http://localhost:8000'

const aggregateId = '8ea640c1-cb7e-4553-b013-125e3d92d5ee'

async function runUpdateEndpoint() {
  try {
    const url = `${BASE_URL}/users/update-user-name`

    for (let i = 0; i < 1000; i += 1) {
      const startTime = Date.now()
      const response = await axios.post(url, { id: aggregateId, name: `Updated Name ${i}` })

      console.log(`${i} Time: ${Date.now() - startTime} ms`)
      console.log(`${i} Status: ${response.status}`)
      console.log(`${i} Response Body: ${JSON.stringify(response.data)}`)
    }
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

runUpdateEndpoint()
