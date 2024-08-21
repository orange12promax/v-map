import { computed, ref, inject } from 'vue'
import { getBetterSymbol } from '@/components/pub-layer/symbol.js'
import { requestService } from '@/services/common.js'
import { mapServer } from '../config.js'
export function usePubLayer(filter) {
  const styleOption = ref()
  const mapServerUrl = inject(mapServer)

  const finalStyleOption = computed(() => {
    if (styleOption.value) {
      const { symbol, filter: originFilter, ...rest } = styleOption.value
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
  const restOption = ref()
  const urlTemplate = computed(() => {
    if (restOption.value?.urlTemplate && mapServerUrl.value) {
      return `${mapServerUrl.value}${restOption.value.urlTemplate}`
    }
    return null
  })
  const finalRestOption = computed(() => {
    if (restOption.value) {
      const { urlTemplate, ...rest } = restOption.value
      const finalUrlTemplate = `${mapServerUrl.value}${urlTemplate}`
      return {
        features: true,
        urlTemplate: finalUrlTemplate,
        ...rest
      }
    }
    return null
  })
  async function queryLayer(id) {
    const res = await requestService({
      url: `${mapServerUrl.value}/style/get/${id}`,
      method: 'GET'
    })
    if (res.code === 200 && res.data) {
      const { style, ...rest } = res.data
      styleOption.value = style
      restOption.value = rest
    } else {
      styleOption.value = null
      restOption.value = null
    }
  }

  const layerOptions = computed(() => {
    if (urlTemplate.value && finalStyleOption.value) {
      return {
        ...finalRestOption.value,
        urlTemplate: urlTemplate.value,
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
