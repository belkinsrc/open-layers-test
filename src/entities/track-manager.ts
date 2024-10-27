import { Feature, Map } from 'ol'
import { LineString } from 'ol/geom'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Style, Stroke } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import { getDevices } from '../api/devices'
import { getTrack } from '../api/track'
import Track from './track'

class TrackManager {
  private map: Map
  private trackLayers: { [transportId: string]: VectorLayer<any> } = {}

  constructor(map: Map) {
    this.map = map
  }

  private async fetchTrackData(transportId: string): Promise<Track | null> {
    const tracksEnum = await getTrack(transportId, '20231212', '20231213')
    const tracksOfTransport = tracksEnum[transportId]
    if (!tracksOfTransport || tracksOfTransport.length === 0) return null

    return new Track(tracksOfTransport[0])
  }

  private createTrackLayer(track: Track): VectorLayer<VectorSource<Feature>> {
    const coordinates = track.getCoordinates().map((coord) => fromLonLat(coord))
    const lineFeature = new Feature({
      geometry: new LineString(coordinates),
      style: this.getTrackStyle(track),
    })

    const vectorSource = new VectorSource<Feature>({
      features: [lineFeature],
    })

    return new VectorLayer({ source: vectorSource })
  }

  private getTrackStyle(track: Track): Style {
    return new Style({
      stroke: new Stroke({
        color: track.getColor() || '#ff0000',
        width: 3,
      }),
    })
  }

  async addTrackToMap(input: HTMLInputElement): Promise<void> {
    const transportId = input.dataset.transport!
    const track = await this.fetchTrackData(transportId)

    if (track) {
      const vectorLayer = this.createTrackLayer(track)
      this.trackLayers[transportId] = vectorLayer
      this.map.addLayer(vectorLayer)

      const extent = vectorLayer.getSource()?.getExtent()
      if (extent) {
        this.map.getView().fit(extent, { padding: [50, 50, 50, 50] })
      }
    }
  }

  removeTrackFromMap(input: HTMLInputElement): void {
    const transportId = input.dataset.transport!
    const trackLayer = this.trackLayers[transportId]
    if (trackLayer) {
      this.map.removeLayer(trackLayer)
      delete this.trackLayers[transportId]
    }
  }

  static async createDevicesHTML(): Promise<string[]> {
    try {
      const { Items: devices } = await getDevices()
      return devices.map((device) => {
        return `<li class="list-item">
            <label>
              <input type="checkbox" data-transport="${device.ID}">
              ${device.Name}
            </label>
          </li>`
      })
    } catch (err) {
      console.error('An error occurred while receiving the data: ' + err)
      return []
    }
  }

  static async displayDevicesHTML(): Promise<void> {
    const devices = await TrackManager.createDevicesHTML()
    const list = document.querySelector('.list--transport')
    if (list) {
      list.innerHTML = ''
      devices.forEach((deviceHTML) => {
        list.innerHTML += deviceHTML
      })
    }
  }
}

export default TrackManager
