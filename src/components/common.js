import { inject, onMounted, watch, toRaw } from 'vue'
import { mapName } from './config'

export function useMapLife() {
  let localMap = null
  const injectMap = inject(mapName)
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
    onMapMounted
  }
}
