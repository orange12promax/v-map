import { inject } from 'vue'
import { mapName } from './config.js'
import { VectorLayer } from './maptalks.js'

export function useVectorLayer() {
  const injectMap = inject(mapName)
  const layerId = window.crypto.randomUUID()
  let layer

  function addVector(item) {
    if (!layer) {
      layer = new VectorLayer(layerId)
      injectMap.value.addLayer(layer)
    }
    item.addTo(layer)
  }
  return {
    addVector
  }
}

export function useCommonLayer() {
  const injectMap = inject(mapName)
  function addLayer(layer) {
    if (layer) {
      injectMap.value.addLayer(layer)
    }
  }
  return {
    addLayer
  }
}
