import { computed } from 'vue'
import { getTiandituUrl, subdomains } from './methods.js'
import VTileLayer from '../maptalks/v-tile-layer.js'

export default {
  name: 'VTiandituLayer',
  props: {
    type: String,
    tk: String,
    zIndex: Number
  },
  setup(props) {
    const tileLayerId = computed(() => `tianditu-${props.type}`)
    const tileLayerOptions = computed(() => {
      return {
        urlTemplate: getTiandituUrl({
          layer: layerProps.type,
          tileMatrixSet: 'w',
          tk: layerProps.tk
        }),
        subdomains,
        zIndex: props.zIndex || 0
      }
    })

    return () => <VTileLayer id={tileLayerId.value} options={tileLayerOptions.value} />
  }
}
