import './style.css'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { Map, View } from 'ol'
import TrackManager from './src/entities/track-manager'
import GeoFenceManager from './src/entities/geo-fence-manager'

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
})

const trackManager = new TrackManager(map)
const geoFenceManager = new GeoFenceManager(map)

async function init() {
  TrackManager.displayDevicesHTML()
  GeoFenceManager.displayGeoFencesHTML()
}
init()

document.addEventListener('DOMContentLoaded', () => {
  const listWrapperOfInputs = document.querySelector('.list-wrapper')

  listWrapperOfInputs.addEventListener('change', (e) => {
    const target = e.target

    if (target.matches('.list input')) {
      toggleSelected(target)
    }
  })
})

function toggleSelected(input) {
  if (input.closest('.list--transport')) {
    return input.checked
      ? trackManager.addTrackToMap(input)
      : trackManager.removeTrackFromMap(input)
  }

  if (input.closest('.list--zone')) {
    return input.checked
      ? geoFenceManager.addZoneToMap(input)
      : geoFenceManager.removeZoneFromMap(input)
  }
}
