import { VectorTileLayer } from '@/components/maptalks/module'
import { watch, onBeforeUnmount, onMounted, inject, computed } from 'vue'

export default {
  name: 'VVectorTileLayer',
  props: {
    id: {
      type: String,
      required: true
    },
    urlTemplate: {
      type: String,
      required: false
    },
    zIndex: {
      type: Number,
      required: false,
      default: 1
    },
    style: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup(props, context) {
    const { addLayer, serverUrl, event } = inject('parentMap')

    const finalUrlTemplate = computed(() => {
      if (serverUrl.value && props.urlTemplate) {
        return `${serverUrl.value}${props.urlTemplate}`
      }
      return null
    })
    const finalZIndex = computed(() => {
      if (props.zIndex >= 0) {
        return props.zIndex
      }
      return 0
    })

    let tileLayer
    function createLayer() {
      if (props.id && finalUrlTemplate.value) {
        tileLayer = new VectorTileLayer(props.id, {
          urlTemplate: finalUrlTemplate.value,
          zIndex: finalZIndex.value,
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
    watch(finalZIndex, (newZIndex) => {
      if (tileLayer) {
        tileLayer.setZIndex(newZIndex)
      } else {
        createLayer()
      }
    })
    watch(finalUrlTemplate, () => {
      if (tileLayer) {
        destroyLayer()
      }
      createLayer()
    })

    event.on('click', (coor) => {
      if (tileLayer) {
        const geometrys = tileLayer.identify(coor)
        if (geometrys instanceof Array && geometrys.length > 0) {
          context.emit(
            'click',
            geometrys.map((item) => ({
              layer: props.id,
              properties: item?.data?.feature?.properties
            }))
          )
        }
      }
    })

    return () => null
  }
}
