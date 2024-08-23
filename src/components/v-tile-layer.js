import { TileLayer } from './common/maptalks.js'
import { onBeforeUnmount, onMounted } from 'vue'
import { useCommonLayer } from './common/common.js'

export default {
  name: 'VTileLayer',
  props: {
    id: String,
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { addLayer } = useCommonLayer()
    let tileLayer
    onMounted(() => {
      tileLayer = new TileLayer(props.id, props.options)
      addLayer(tileLayer)
    })
    onBeforeUnmount(() => {
      // remove layer from map
      tileLayer.remove()
    })
    return () => null
  }
}
