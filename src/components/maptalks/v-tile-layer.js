import { TileLayer } from '@/components/maptalks/module.js'
import { inject, onBeforeUnmount, onMounted } from 'vue'

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
    const { addLayer } = inject('parentMap')
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
