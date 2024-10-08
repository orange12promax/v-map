import { computed, inject, ref } from 'vue'
import { useFetch } from '@/services/common.js'
import { getBetterSymbol } from '@/components/pub/symbol.js'

export function usePubVtLayer() {
  const { serverUrl } = inject('parentMap')
  const fetchStyleUrl = ref()

  const { execute: executeFetchStyle, coreData } = useFetch(fetchStyleUrl)

  const dataType = computed(() => coreData.value?.type)

  const renderPlugin = computed(() => {
    switch (dataType.value) {
      case 'line': {
        return {
          type: 'line',
          dataConfig: {
            type: 'line'
          }
        }
      }
      case 'fill': {
        return {
          type: 'fill',
          dataConfig: {
            type: 'fill'
          }
        }
      }
      case 'point': {
        return {
          type: 'icon',
          dataConfig: {
            type: 'point'
          }
        }
      }
      default: {
        return null
      }
    }
  })

  const symbol = computed(() => {
    if (coreData.value?.style) {
      const symbolOptions = {
        serverUrl: serverUrl.value
      }
      return getBetterSymbol(coreData.value?.style, symbolOptions)
    }
    return null
  })

  const zIndex = computed(() => {
    return coreData.value?.style?.zindex || 10
  })
  const jsonData = computed(() => {
    return coreData.value?.json
  })

  async function queryLayer(id, wfs = false) {
    let serviceName = wfs ? 'wfs' : 'style'
    fetchStyleUrl.value = `/${serviceName}/get/${id}`
    executeFetchStyle()
  }

  return {
    queryLayer,
    zIndex,
    symbol,
    dataType,
    renderPlugin,
    jsonData
  }
}
