import axios from 'axios'
import GeoFence from '../models/geo-fence'
import { Group, VirtualTree } from '../models/schema'
import { login } from '../auth/auth'
import { getSchemas } from './schemas'

interface GeoFencesResponse {
  ID: string
  Groups: Group[]
  Items: GeoFence[]
  VirtualTrees: VirtualTree[]
  VirtualTreeAssigned: string
}

async function getGeoFences(): Promise<GeoFencesResponse> {
  const token = await login()
  const schemas = await getSchemas(token)
  const [schema] = schemas
  const { ID: schemaID } = schema

  try {
    const res = await axios.get(
      'https://test.agweb.cloud/ServiceJSON/EnumGeoFences',
      {
        params: {
          session: token,
          schemaID,
        },
      }
    )
    return res.data
  } catch (err) {
    console.error('An error occurred while the request: ' + err)
    return {} as GeoFencesResponse
  }
}

export { getGeoFences }
