import { computed, inject, ref } from 'vue'
import { useFetch } from '@/services/common.js'
import { getBetterSymbol } from '@/components/pub-layer/symbol.js'

export function usePubVtLayer() {
  const { serverUrl } = inject('parentMap')
  const fetchStyleUrl = ref()

  const { execute: executeFetchStyle, coreData } = useFetch(fetchStyleUrl)

  const renderPlugin = computed(() => {
    switch (coreData.value?.type) {
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
    return coreData.value?.style?.zindex
  })

  async function queryLayer(id) {
    fetchStyleUrl.value = `/style/get/${id}`
    executeFetchStyle()
  }

  return {
    queryLayer,
    zIndex,
    symbol,
    renderPlugin
  }
}
