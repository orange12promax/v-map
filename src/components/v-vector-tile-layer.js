import { useCommonLayer } from './common'
import { VectorTileLayer } from './maptalks.js'
import { watch, onBeforeUnmount, onMounted, inject } from 'vue'
import { mapEvent } from '@/components/config.js'

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
  setup(props, context) {
    const ee = inject(mapEvent)
    const { addLayer } = useCommonLayer()
    let tileLayer
    function createLayer() {
      if (props.id && props.urlTemplate) {
        tileLayer = new VectorTileLayer(props.id, {
          urlTemplate: props.urlTemplate,
          zIndex: props.zIndex,
          style: props.style,
          features: true
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

    ee.on('click', (coor) => {
      if (tileLayer) {
        const geometrys = tileLayer.identify(coor)
        if (geometrys instanceof Array && geometrys.length > 0) {
          context.emit('click', geometrys)
        }
      }
    })

    return () => null
  }
}
