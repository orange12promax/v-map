import { computed, ref } from 'vue'
import { getBetterSymbol } from '@/components/pub-layer/symbol.js'
import { useFetch } from '@/services/common.js'

export function usePubLayer(filter) {
  const fetchStyleUrl = ref()
  const fetchFeatureUrl = ref()
  const { execute: executeFetchStyle, data: styleData } = useFetch(fetchStyleUrl)
  const {
    isFinished: isFeatureFinished,
    execute: executeFetchFeature,
    data: featureData
  } = useFetch(fetchFeatureUrl)
  const style = computed(() => {
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

  const urlTemplate = computed(() => {
    return styleData.value?.urlTemplate
  })
  const zIndex = computed(() => {
    return styleData.value?.zindex
  })

  async function queryLayer(id) {
    fetchStyleUrl.value = `/style/get/${id}`
    executeFetchStyle()
    fetchFeatureUrl.value = `/wfs/get/${id}`
    executeFetchFeature()
  }

  return {
    queryLayer,
    style,
    urlTemplate,
    zIndex
  }
}
