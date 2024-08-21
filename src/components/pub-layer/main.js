import { computed, ref } from 'vue'
import { getBetterSymbol } from '@/components/pub-layer/symbol.js'
import { getServerUrl } from '@/services/common.js'
import { getStyle } from '@/services/style.js'

export function usePubLayer() {
  const styleOption = ref()
  const finalStyleOption = computed(() => {
    if (styleOption.value) {
      const { symbol, filter, ...rest } = styleOption.value
      let finalFilter = filter
      if (props.filter.length > 0) {
        finalFilter = props.filter
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
  const finalRestOption = computed(() => {
    if (restOption.value) {
      const { urlTemplate, ...rest } = restOption.value
      const finalUrlTemplate = `${getServerUrl()}${urlTemplate}`
      return {
        features: true,
        urlTemplate: finalUrlTemplate,
        ...rest
      }
    }
    return null
  })
  async function queryLayer(id) {
    const res = await getStyle(id)
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
    if (finalStyleOption.value && finalRestOption.value) {
      return {
        ...finalStyleOption.value,
        ...finalRestOption.value
      }
    }
    return null
  })

  return {
    queryLayer,
    layerOptions,
    finalStyleOption
  }
}
