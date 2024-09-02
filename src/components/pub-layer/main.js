import { computed, ref, inject } from 'vue'
import { getBetterSymbol } from '@/components/pub-layer/symbol.js'
import { useFetch } from '@/services/common.js'

export function usePubVtLayer(filter) {
  const { serverUrl } = inject('parentMap')
  const fetchStyleUrl = ref()

  const { execute: executeFetchStyle, coreData: styleData } = useFetch(fetchStyleUrl)

  const style = computed(() => {
    if (styleData.value?.style) {
      const { symbol, filter: originFilter, ...rest } = styleData.value.style
      let finalFilter = originFilter
      if (filter.value instanceof Array && filter.value.length > 0) {
        finalFilter = filter.value
      }
      return {
        symbol: getBetterSymbol(symbol, { serverUrl }),
        filter: finalFilter,
        ...rest
      }
    }
    return null
  })

  const urlTemplate = computed(() => {
    return styleData.value?.urlTemplate
  })
  const zIndex = computed(() => {
    return styleData.value?.zindex
  })

  async function queryLayer(id) {
    fetchStyleUrl.value = `/style/get/${id}`
    executeFetchStyle()
  }

  return {
    queryLayer,
    style,
    urlTemplate,
    zIndex
  }
}

export function usePubGeoJsonLayer() {
  const fetchFeatureUrl = ref()
  const {
    isFinished: isFeatureFinished,
    execute: executeFetchFeature,
    data: featureData
  } = useFetch(fetchFeatureUrl)
  async function queryJson(id) {
    fetchFeatureUrl.value = `/wfs/get/${id}`
    executeFetchFeature()
  }
  return {
    queryJson,
    isFeatureFinished,
    featureData
  }
}
