import { onMounted, computed } from 'vue'
import { usePubLayer } from './pub-layer/main'
import VVectorTileLayer from './v-vector-tile-layer.js'

export default {
  name: 'VPubLayer',
  props: {
    id: String,
    filter: {
      type: Array,
      default: () => []
    }
  },
  setup(props, context) {
    const filter = computed(() => props.filter)
    const { queryLayer, style, urlTemplate, zIndex } = usePubLayer(filter)

    onMounted(async () => {
      await queryLayer(props.id)
    })

    function handleClick(e) {
      context.emit('click', e)
    }
    return () => (
      <VVectorTileLayer
        id={props.id}
        urlTemplate={urlTemplate.value}
        zIndex={zIndex.value}
        style={style.value}
        onCreated={handleClick}
      />
    )
  }
}
