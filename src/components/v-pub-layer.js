import { useMapLife } from './common'
import { VectorTileLayer } from '@maptalks/vt'
import { watch, onBeforeUnmount } from 'vue'
import { getStyle } from '../services/style'

export default {
  name: 'VPubLayer',
  props: {
    id: String
  },
  setup(props, context) {
    const { onMapMounted, ee } = useMapLife()
    let tileLayer
    onMapMounted((map) => {
      getStyle(props.id).then((res) => {
        if (res.code === 200) {
          tileLayer = new VectorTileLayer(props.id, { features: true, ...res.data })
          tileLayer.addTo(map)
        }
      })
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
