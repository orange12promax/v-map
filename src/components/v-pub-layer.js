import { getServerUrl } from '../services/common'
import { useCommonLayer, useMapLife } from './common'
import { VectorTileLayer } from '@maptalks/vt'
import { watch, onBeforeUnmount, computed, ref, onMounted } from 'vue'
import { getStyle } from '../services/style'
import { usePubLayer } from './pub-layer/main'

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
    const { addLayer } = useCommonLayer()
    const { queryLayer, layerOptions, finalStyleOption } = usePubLayer()

    let tileLayer

    function destroyLayer() {
      if (tileLayer) {
        tileLayer.remove()
        tileLayer = null
      }
    }

    function createLayer(id, options) {
      destroyLayer()
      if (options) {
        tileLayer = new VectorTileLayer(id, options)
        addLayer(tileLayer)
      }
    }

    onMounted(() => {
      queryLayer(props.id)
    })

    onMapMounted(() => {
      createLayer(props.id, layerOptions.value)
    })
    watch(finalStyleOption, (nv) => {
      if (tileLayer) {
        tileLayer.setStyle(nv)
      }
    })
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
