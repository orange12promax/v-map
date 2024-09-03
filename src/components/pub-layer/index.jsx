import { onMounted, computed } from 'vue'
import { usePubVtLayer } from './vt.js'
import VVectorTileLayer from '../vector-tile-layer/v-vector-tile-layer.js'
import VVectorLayer from '../maptalks/v-vector-layer.vue'
import VGeoJson from '../maptalks/geometry/v-geo-json.js'

export default {
  name: 'VPubLayer',
  props: {
    id: String,
    filter: {
      type: Array,
      default: () => []
    },
    render: String
  },
  setup(props, context) {
    const urlTemplate = computed(() => `/tile/{z}/{x}/{y}?layer=${props.id}`)
    const { queryLayer, zIndex, symbol, renderPlugin } = usePubVtLayer()
    const style = computed(() => {
      if (symbol.value && renderPlugin.value) {
        return {
          symbol: symbol.value,
          renderPlugin: renderPlugin.value,
          filter: props.filter && props.filter.length > 0 ? props.filter : true
        }
      }
      return null
    })

    onMounted(() => {
      queryLayer(props.id)
    })

    function handleClick(e) {
      context.emit('click', e)
    }
    switch (props.render) {
      case 'geoJson':
        return () => (
          <VVectorLayer id={props.id} zIndex={zIndex.value} style={style.value}>
            <VGeoJson id={props.id} />
          </VVectorLayer>
        )
      case 'vt':
        return () => (
          <VVectorTileLayer
            id={props.id}
            urlTemplate={urlTemplate.value}
            zIndex={zIndex.value}
            style={style.value}
            onClick={handleClick}
          />
        )
      default:
        return () => null
    }
  }
}
