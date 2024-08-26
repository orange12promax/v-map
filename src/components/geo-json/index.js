import { VectorLayer, GeoJSON } from '@/components/maptalks/module'
import { watch, onBeforeUnmount, onMounted, inject } from 'vue'
import { mapEvent, mapMethods } from '@/components/common/config.js'

export default {
  name: 'VGeoJsonLayer',
  props: {
    id: {
      type: String,
      required: true
    },
    json: {
      type: Object,
      required: false
    },
    style: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup(props, context) {
    const ee = inject(mapEvent)
    const { addLayer } = inject(mapMethods)

    let tileLayer
    function createLayer() {
      if (props.id && props.json) {
        tileLayer = new VectorLayer(props.id, {
          style: props.style,
          features: true,
          hitDetect: false
        })
        const { features, ...rest } = props.json
        const validFeatures = features.filter((item) => !!item.geometry)
        const validJson = {
          features: validFeatures,
          ...rest
        }
        const geometry = GeoJSON.toGeometry(validJson)
        console.log(geometry)
        tileLayer.addGeometry(geometry)
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
      () => props.json,
      () => {
        if (tileLayer) {
          destroyLayer()
        }
        createLayer()
      }
    )

    ee.on('click', (coor) => {
      if (tileLayer) {
        const geometrys = tileLayer.identify(coor)
        const newGeo = geometrys.map(({ properties }) => ({ properties, layer: props.id }))
        if (geometrys instanceof Array && geometrys.length > 0) {
          context.emit('click', newGeo)
        }
      }
    })

    return () => null
  }
}
