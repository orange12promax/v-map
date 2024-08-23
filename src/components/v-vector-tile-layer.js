import { useCommonLayer } from './common'
import { VectorTileLayer } from './maptalks.js'
import { ref, watch, onBeforeUnmount, onMounted } from 'vue'

export default {
  name: 'VVectorTileLayer',
  props: {
    id: {
      type: String,
      required: true
    },
    urlTemplate: {
      type: String,
      required: true
    },
    zIndex: {
      type: Number,
      default: 1
    },
    style: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { addLayer } = useCommonLayer()
    let tileLayer
    function createLayer() {
      if (props.id && props.urlTemplate) {
        tileLayer = new VectorTileLayer(props.id, {
          urlTemplate: props.urlTemplate,
          zIndex: props.zIndex,
          style: props.style
        })
        addLayer(tileLayer)
      }
    }
    function destroyLayer() {
      if (tileLayer && tileLayer.remove) {
        tileLayer.remove()
      }
    }
    onMounted(() => {
      destroyLayer()
      createLayer()
    })
    onBeforeUnmount(() => {
      destroyLayer()
    })

    watch(
      () => props.style,
      (newStyle) => {
        if (tileLayer) {
          tileLayer.setStyle(newStyle)
        } else {
          createLayer()
        }
      }
    )
    watch(
      () => props.zIndex,
      (newZIndex) => {
        if (tileLayer) {
          tileLayer.setZIndex(newZIndex)
        } else {
          createLayer()
        }
      }
    )
    return () => null
  }
}
