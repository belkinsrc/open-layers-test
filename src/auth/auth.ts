import axios from 'axios'
import storage from '../utils/storage'

const loginData = {
  UserName: 'userapi',
  Password: 123,
}

async function login(): Promise<string> {
  const token = storage.getItem('token')
  if (token) {
    return token
  }
  
  try {
    const res = await axios.post(
      'https://test.agweb.cloud/ServiceJSON/Login',
      loginData
    )
    console.log('Successful connection to server...')
    storage.setItem('token', res.data)
    return res.data
  } catch (err) {
    console.error('An error occurred while the connection to server: ' + err)
    return ''
  }
}

export { login }
