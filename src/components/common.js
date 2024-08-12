import { inject, onMounted, watch, toRaw } from 'vue'
import { mapName, mapEvent } from './config'
import { Marker, VectorLayer } from './maptalks'

export function useMapLife() {
  let localMap = null
  const injectMap = inject(mapName)
  const ee = inject(mapEvent)
  let mapMountedCallback

  onMounted(() => {
    if (!localMap && injectMap?.value) {
      localMap = toRaw(injectMap.value)
      if (mapMountedCallback) {
        mapMountedCallback(localMap)
      }
    }
  })
  watch(
    () => injectMap?.value,
    (newValue, oldValue) => {
      if (!oldValue && newValue && !localMap) {
        localMap = toRaw(newValue)
        if (mapMountedCallback) {
          mapMountedCallback(localMap)
        }
      }
    }
  )

  function onMapMounted(callback) {
    mapMountedCallback = callback
  }

  return {
    onMapMounted,
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
