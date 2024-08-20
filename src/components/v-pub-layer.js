import { getServerUrl } from '../services/common'
import { useMapLife } from './common'
import { VectorTileLayer } from '@maptalks/vt'
import { watch, onBeforeUnmount, computed, ref } from 'vue'
import { getStyle } from '../services/style'

export default {
  name: 'VPubLayer',
  props: {
    id: String,
    filter: {
      type: Array,
      default: () => []
    }
  },
  setup(props, context) {
    const { onMapMounted, ee } = useMapLife()
    let tileLayer

    function string2array(str) {
      if (str) {
        return JSON.parse(str)
      } else {
        return []
      }
    }

    function prepareSymbol(originalSymbol) {
      const { markerFileType, markerFile, markerFileProp, markerFilePropList, ...rest } =
        originalSymbol
      if (markerFileType === 'rule') {
        return {
          markerFile: {
            type: 'categorical',
            property: markerFileProp,
            stops: string2array(markerFilePropList),
            default: markerFile
          },
          ...rest
        }
      } else {
        return { markerFile, ...rest }
      }
    }

    const layerOptions = computed(() => {
      const {
        style: { symbol, ...restStyle },
        urlTemplate,
        ...restData
      } = layerOriginOptions.value
      const nextOptions = {
        features: true,
        ...restData,
        urlTemplate: `${getServerUrl()}${urlTemplate}`,
        style: {
          ...restStyle,
          symbol: prepareSymbol(symbol)
        }
      }
      if (props.filter.length > 0) {
        nextOptions.style.filter = props.filter
      }
      return nextOptions
    })

    const layerOriginOptions = ref({})

    onMapMounted((map) => {
      getStyle(props.id).then((res) => {
        if (res.code === 200) {
          layerOriginOptions.value = res.data
          tileLayer = new VectorTileLayer(props.id, layerOptions.value)
          tileLayer.addTo(map)
        }
      })
    })
    watch(
      () => props.filter,
      () => {
        if (tileLayer) {
          tileLayer.setOptions(layerOptions.value)
        }
      }
    )
    onBeforeUnmount(() => {
      tileLayer.remove()
    })

    // function simplifyEventData(item) {
    //   const { coordinate, data, point } = item
    //   return {
    //     coordinate,
    //     feature: data?.feature,
    //     point
    //   }
    // }

    ee.on('click', (coor) => {
      if (tileLayer) {
        const geometrys = tileLayer.identify(coor)
        if (geometrys instanceof Array && geometrys.length > 0) {
          context.emit('click', geometrys)
        }
      }
    })

    return () => null
  }
}
