import { useCommonLayer } from './common'
import { VectorTileLayer } from '@maptalks/vt'
import { watch, onBeforeUnmount, onMounted, computed, inject } from 'vue'
import { usePubLayer } from './pub-layer/main'
import { mapEvent } from '@/components/config.js'

export default {
  name: 'VPubLayer',
  props: {
    id: String,
    filter: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const ee = inject(mapEvent)
    const { addLayer } = useCommonLayer()
    const filter = computed(() => props.filter)
    const { queryLayer, layerOptions } = usePubLayer(filter)
    let tileLayer

    function destroyLayer() {
      if (tileLayer) {
        tileLayer.remove()
        tileLayer = null
      }
    }

    function createLayer(id, options) {
      destroyLayer()
      if (options) {
        tileLayer = new VectorTileLayer(id, options)
        addLayer(tileLayer)
      }
    }

    onMounted(async () => {
      await queryLayer(props.id)
      createLayer(props.id, layerOptions.value)
    })

    watch(layerOptions, (nv) => {
      console.log(nv)
      createLayer(props.id, nv)
    })

    onBeforeUnmount(() => {
      tileLayer.remove()
    })

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
