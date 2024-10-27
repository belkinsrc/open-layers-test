interface Track {
  index: number
  dt: string[]
  speed: number[]
  Lat: number[]
  Lng: number[]
  photos: {
    index: number
    fileName: string
  }[]
  colorSettings: {
    definedBy: number
    parameter: {
      name: string
      colors: {
        color: string
        value: string
      }[]
      min: number
      max: number
    }
    defaultColor: string
    trackMaxDuration: number
    values: string
  }
}

export default Track
