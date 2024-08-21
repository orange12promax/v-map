import { useCommonLayer } from './common'
import { VectorTileLayer } from '@maptalks/vt'
import { watch, onBeforeUnmount, onMounted } from 'vue'

export default {
  name: 'VVectorTileLayer',
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
      tileLayer = new VectorTileLayer(props.id, props.options)
      addLayer(tileLayer)
    })
    onBeforeUnmount(() => {
      tileLayer.remove()
    })

    watch(props.options.style, (newStyle) => {
      tileLayer.setStyle(newStyle)
    })
    return () => null
  }
}
