import { TileLayer } from '@/components/maptalks/module.js'
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { getUuid } from '@/utils'

export default {
  name: 'VTileLayer',
  props: {
    id: String,
    options: Object
  },
  setup(props) {
    let uid = props.id || getUuid()
    const { addLayer } = inject('parentMap')
    let tileLayer
    onMounted(() => {
      tileLayer = new TileLayer(uid, props.options)
      addLayer(tileLayer)
    })
    onBeforeUnmount(() => {
      tileLayer.remove()
    })
    return () => null
  }
}
