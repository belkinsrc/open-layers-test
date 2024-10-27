interface GeoFence {
  ID: string
  ParentID: string
  Name: string
  Properties: [
    {
      Inherited: boolean
      Type: number
      Name: string
      Value: string
    }
  ],
  Image: string,
  ImageColored: string
}

export default GeoFence