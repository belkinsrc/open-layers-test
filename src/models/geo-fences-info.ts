interface GeoFencesInfo {
  ID: string
  ParentID: string
  Name: string
  IsPolygon: boolean
  R: number
  Lat: number[]
  Lng: number[]
  Holes: Array<{
    Lat: number[]
    Lng: number[]
  }>
  ImageName: string
  ImageHue: number
  Fill: number
  Line: number
  LineWidth: number
}

export default GeoFencesInfo
