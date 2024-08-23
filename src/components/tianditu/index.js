import { useCommonLayer } from '../common.js'
import { TileLayer } from '../maptalks.js'
import { onBeforeUnmount, computed, watch, onMounted } from 'vue'
import { getTiandituUrl, subdomains } from './methods.js'

export default {
  name: 'VTiandituLayer',
  props: {
    type: String,
    tk: String,
    zIndex: Number
  },
  setup(props) {
    const { addLayer } = useCommonLayer()

    let tileLayer

    const layerParam = computed(() => ({
      type: props.type,
      tk: props.tk
    }))

    function destroyLayer() {
      if (tileLayer) {
        tileLayer.remove()
        tileLayer = null
      }
    }

    function createLayer(layerProps) {
      destroyLayer()
      tileLayer = new TileLayer(`tianditu-${layerProps.type}`, {
        urlTemplate: getTiandituUrl({
          layer: layerProps.type,
          tileMatrixSet: 'w',
          tk: layerProps.tk
        }),
        subdomains,
        zIndex: props.zIndex || 0
      })
      addLayer(tileLayer)
    }

    onMounted(() => {
      createLayer(layerParam.value)
    })
    onBeforeUnmount(() => {
      tileLayer.remove()
    })
    watch(layerParam, (newValue) => {
      createLayer(newValue)
    })
    watch(
      () => props.zIndex,
      (newValue) => {
        tileLayer?.setZIndex(newValue)
      }
    )

    return () => null
  }
}
