import { useMapLife, useCommonLayer } from './common'
import { TileLayer } from './maptalks'
import { onBeforeUnmount, computed, watch } from 'vue'
import { getTiandituUrl, subdomains } from './tianditu'

export default {
  name: 'VTiandituLayer',
  props: {
    type: String,
    tk: String,
    zIndex: Number
  },
  setup(props) {
    const { onMapMounted } = useMapLife()
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

    onMapMounted(() => {
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
