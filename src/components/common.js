import { inject } from 'vue'
import { mapName, mapEvent } from './config'
import { VectorLayer } from './maptalks'

export function useMapLife() {
  const ee = inject(mapEvent)
  return {
    ee
  }
}

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
