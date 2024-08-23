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
    const { queryLayer, layerOptions } = usePubLayer(filter)

    onMounted(async () => {
      await queryLayer(props.id)
    })

    function handleClick(e) {
      context.emit('click', e)
    }
    return () =>
      layerOptions.value ? (
        <VVectorTileLayer
          id={props.id}
          urlTemplate={layerOptions.value.urlTemplate}
          zIndex={layerOptions.value.zIndex}
          style={layerOptions.value.style}
          onCreated={handleClick}
        />
      ) : null
  }
}
