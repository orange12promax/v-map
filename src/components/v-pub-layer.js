import { useMapLife } from './common'
import { VectorTileLayer } from '@maptalks/vt'
import { watch, onBeforeUnmount } from 'vue'
import { getStyle } from '@/services/style'

export default {
  name: 'VPubLayer',
  props: {
    id: String
  },
  setup(props) {
    const { onMapMounted } = useMapLife()
    let tileLayer
    onMapMounted((map) => {
      getStyle(props.id).then((options) => {
        tileLayer = new VectorTileLayer(props.id, options)
        tileLayer.addTo(map)
      })
    })
    onBeforeUnmount(() => {
      tileLayer.remove()
    })

    return () => null
  }
}
