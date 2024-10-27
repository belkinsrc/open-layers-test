interface Device {
  ID: string
  parentId: string
  Name: string
  serial: number
  allowed: true
  properties: [
    {
      inherited: boolean
      type: number
      name: string
      value: string
    }
  ]
  fixedLocation: {
    lat: number
    lng: number
  }
  image: string
  imageColored: string
  tripSplitters: [
    {
      id: number
      name: string
    }
  ]
  isAreaEnabled: boolean
  imageHue: number
}

export default Device
