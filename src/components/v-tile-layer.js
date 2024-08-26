import { TileLayer } from '@/components/maptalks/module'
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { mapMethods } from '@/components/common/config.js'

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
    const { addLayer } = inject(mapMethods)
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
