import { useMapLife } from './common'
import { TileLayer } from './maptalks'
import { onBeforeUnmount } from 'vue'
import { getTiandituUrl, subdomains } from './tianditu'

export default {
  name: 'VTiandituLayer',
  props: {
    type: String,
    tk: String
  },
  setup(props) {
    const { onMapMounted } = useMapLife()
    let tileLayer
    const layerId = `tianditu-${props.type}`
    onMapMounted((map) => {
      tileLayer = new TileLayer(layerId, {
        urlTemplate: getTiandituUrl({
          layer: props.type,
          tileMatrixSet: 'w',
          tk: props.tk
        }),
        subdomains
      })
      tileLayer.addTo(map)
    })
    onBeforeUnmount(() => {
      // remove layer from map
      tileLayer.remove()
    })
    return () => null
  }
}
