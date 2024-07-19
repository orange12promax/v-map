import { useMapLife } from './common'
import { TileLayer } from './maptalks'
import { onBeforeUnmount } from 'vue'
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
    const { onMapMounted } = useMapLife()
    let tileLayer
    onMapMounted((map) => {
      tileLayer = new TileLayer(props.id, props.options)
      tileLayer.addTo(map)
    })
    onBeforeUnmount(() => {
      // remove layer from map
      tileLayer.remove()
    })
    return () => null
  }
}
