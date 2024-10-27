import axios from 'axios'
import Device from '../models/device'
import { Group, VirtualTree } from '../models/schema'
import { login } from '../auth/auth'
import { getSchemas } from './schemas'

interface DevicesResponse {
  ID: string
  Groups: Group[]
  Items: Device[]
  VirtualTrees: VirtualTree[]
  VirtualTreeAssigned: string
}

async function getDevices(): Promise<DevicesResponse> {
  const token = await login()
  const schemas = await getSchemas(token)
  const [schema] = schemas
  const { ID: schemaID } = schema

  try {
    const res = await axios.get(
      'https://test.agweb.cloud/ServiceJSON/EnumDevices',
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
    return {} as DevicesResponse
  }
}

export { getDevices }
