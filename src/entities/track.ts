class Track {
  private data: any

  constructor(data: any) {
    this.data = data
  }

  getCoordinates(): [number, number][] {
    const coordinates: [number, number][] = []
    for (let i = 0; i < this.data.Lat.length; i++) {
      coordinates.push([this.data.Lng[i], this.data.Lat[i]])
    }
    return coordinates
  }

  getColor(): string {
    return this.data.ColorSettings?.DefaultColor || '#ff0000'
  }
}

export default Track
