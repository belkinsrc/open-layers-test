import axios from 'axios'
import Track from '../models/track'
import { login } from '../auth/auth'
import { getSchemas } from './schemas'

async function getTrack(deviceIds: string | string[], SD: string, ED: string): Promise<Track> {
  try {
    const token = await login()
    const schemas = await getSchemas(token)
    const [schema] = schemas
    const { ID: schemaID } = schema

    const res = await axios.get(
      'https://test.agweb.cloud/ServiceJSON/GetTrack',
      {
        params: {
          session: token,
          schemaID,
          IDs: deviceIds.toString(),
          SD,
          ED,
        },
      }
    )
    return res.data
  } catch (err) {
    console.error('An error occurred while the request: ' + err)
    return {} as Track
  }
}

export { getTrack }
