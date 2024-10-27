import axios from 'axios'
import { Schema } from '../models/schema'

async function getSchemas(token: string): Promise<Schema[]> {
  try {
    const res = await axios.get('https://test.agweb.cloud/ServiceJSON/EnumSchemas', {
      params: {
        session: token,
      },
    })
    return res.data
  } catch (err) {
    console.log('An error occurred while the request: ' + err)
    return []
  }
}

export { getSchemas }
