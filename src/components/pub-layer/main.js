import { computed, ref, inject } from 'vue'
import { getBetterSymbol } from '@/components/pub-layer/symbol.js'
import { mapServer } from '../config.js'
import { useFetch } from '@/services/common.js'

export function usePubLayer(filter) {
  const mapServerUrl = inject(mapServer)
  const fetchStyleUrl = ref()
  const fetchFeatureUrl = ref()
  const { execute: executeFetchStyle, data: styleData } = useFetch(fetchStyleUrl)
  const {
    isFinished: isFeatureFinished,
    execute: executeFetchFeature,
    data: featureData
  } = useFetch(fetchFeatureUrl)
  const finalStyleOption = computed(() => {
    if (styleData.value?.style) {
      const { symbol, filter: originFilter, ...rest } = styleData.value.style
      let finalFilter = originFilter
      if (filter.value instanceof Array && filter.value.length > 0) {
        finalFilter = filter.value
      }
      return {
        symbol: getBetterSymbol(symbol),
        filter: finalFilter,
        ...rest
      }
    }
    return null
  })

  const finalRestOption = computed(() => {
    if (styleData.value && mapServerUrl.value) {
      const { urlTemplate, zindex, ...rest } = styleData.value
      const finalUrlTemplate = `${mapServerUrl.value}${urlTemplate}`
      const finalZIndex = zindex || 1
      return {
        features: true,
        urlTemplate: finalUrlTemplate,
        zIndex: finalZIndex,
        ...rest
      }
    }
    return null
  })
  async function queryLayer(id) {
    fetchStyleUrl.value = `/style/get/${id}`
    executeFetchStyle()
    fetchFeatureUrl.value = `/wfs/get/${id}`
    executeFetchFeature()
  }

  const layerOptions = computed(() => {
    if (finalStyleOption.value && finalRestOption.value) {
      return {
        ...finalRestOption.value,
        style: finalStyleOption.value
      }
    }
    return null
  })

  return {
    queryLayer,
    layerOptions
  }
}
