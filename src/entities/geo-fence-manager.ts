import { Map, Feature } from 'ol'
import { Polygon, Circle as CircleGeom } from 'ol/geom'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Style, Fill, Stroke } from 'ol/style'
import { FeatureLike } from 'ol/Feature'
import { fromLonLat } from 'ol/proj'
import { getGeoFences } from '../api/geo-fences'
import { getGeoFencesInfo } from '../api/geo-fences-info'
import GeoFencesInfo from '../models/geo-fences-info'

class GeoFenceManager {
  private map: Map
  private geoFenceLayers: { [zoneId: string]: VectorLayer<any> } = {}

  constructor(map: Map) {
    this.map = map
  }

  static async createGeoFencesHTML(): Promise<string[]> {
    try {
      const { Items: enumGeoFences } = await getGeoFences()
      const geoFencesIds = enumGeoFences.slice(0, 10).map((obj) => obj.ID)
      const geoFencesInfo = await getGeoFencesInfo(geoFencesIds)

      return Object.values(geoFencesInfo).map((zone) => {
        return (
          `<li class="list-item">
            <label>
              <input type="checkbox" data-zone="${zone.ID}">
              ${zone.Name}
            </label>
          </li>`
        )
      })
    } catch (err) {
      console.error('An error occurred while receiving the data: ' + err)
      return []
    }
  }

  static async displayGeoFencesHTML(): Promise<void> {
    const geoFences = await GeoFenceManager.createGeoFencesHTML()
    const list = document.querySelector('.list--zone')

    if (list) {
      list.innerHTML = ''
      geoFences.forEach((zone) => {
        list.innerHTML += zone
      })
    }
  }

  async addZoneToMap(input: HTMLInputElement): Promise<void> {
    const zoneId = input.dataset.zone!
    const geoFencesEnum = await getGeoFencesInfo([zoneId])
    const geoFence = geoFencesEnum[zoneId]

    if (geoFence) {
      const vectorLayer = this.createGeoFenceLayer(geoFence)
      this.geoFenceLayers[zoneId] = vectorLayer
      this.map.addLayer(vectorLayer)

      const extent = vectorLayer.getSource()?.getExtent()
      if (extent) {
        this.map.getView().fit(extent, { padding: [50, 50, 50, 50] })
      }
    }
  }

  removeZoneFromMap(input: HTMLInputElement): void {
    const zoneId = input.dataset.zone!
    const vectorLayer = this.geoFenceLayers[zoneId]

    if (vectorLayer) {
      this.map.removeLayer(vectorLayer)
      delete this.geoFenceLayers[zoneId]
    }
  }

  private createGeoFenceLayer(geoFence: GeoFencesInfo): VectorLayer<any> {
    const vectorSource = new VectorSource<FeatureLike>()

    if (geoFence.IsPolygon) {
      const coordinates = geoFence.Lat.map((lat, i) =>
        fromLonLat([geoFence.Lng[i], lat])
      )
      const holeCoordinates = geoFence.Holes
        ? geoFence.Holes.map((hole) =>
            hole.Lat.map((lat, i) => fromLonLat([hole.Lng[i], lat]))
          )
        : []
      const polygon = new Polygon([coordinates, ...holeCoordinates])
      const feature = new Feature(polygon)
      vectorSource.addFeature(feature)
    } else {
      const center = fromLonLat([geoFence.Lng[0], geoFence.Lat[0]])
      const circle = new CircleGeom(center, geoFence.R)
      const feature = new Feature(circle)
      vectorSource.addFeature(feature)
    }

    const style = new Style({
      fill: new Fill({
        color: `rgba(${geoFence.Fill}, 0.5)`,
      }),
      stroke: new Stroke({
        color: `#${geoFence.Line.toString(16).padStart(6, '0')}`,
        width: geoFence.LineWidth || 2,
      }),
    })

    return new VectorLayer({
      source: vectorSource,
      style,
    })
  }
}

export default GeoFenceManager
