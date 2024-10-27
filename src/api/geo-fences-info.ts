import axios from 'axios'
import GeoFencesInfo from '../models/geo-fences-info'
import { login } from '../auth/auth'
import { getSchemas } from './schemas'

async function getGeoFencesInfo(IDs?: string[]): Promise<GeoFencesInfo> {
  const token = await login()
  const schemas = await getSchemas(token)
  const [schema] = schemas
  const { ID: schemaID } = schema

  try {
    const res = await axios.get(
      'https://test.agweb.cloud/ServiceJSON/GetGeofences',
      {
        params: {
          session: token,
          schemaID,
          IDs: IDs?.toString() || ''
        },
      }
    )
    return res.data
  } catch (err) {
    console.error('An error occurred while the request: ' + err)
    return {} as GeoFencesInfo
  }
}

export { getGeoFencesInfo }
