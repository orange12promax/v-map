import { onMounted, computed } from 'vue'
import { usePubVtLayer } from './vt.js'
import { usePubGeoJsonLayer } from './geoJson.js'
import VVectorTileLayer from '../vector-tile-layer/v-vector-tile-layer.js'
import VGeoJsonLayer from '../geo-json/index.js'

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
    const style = computed(() => ({
      symbol: symbol.value,
      renderPlugin: renderPlugin.value,
      filter: props.filter && props.filter.length > 0 ? props.filter : true
    }))
    const { queryJson, featureData } = usePubGeoJsonLayer()
    onMounted(() => {
      queryLayer(props.id)
      queryJson(props.id)
    })

    function handleClick(e) {
      context.emit('click', e)
    }
    switch (props.render) {
      case 'geojson':
        return () => (
          <VGeoJsonLayer
            id={props.id}
            json={featureData.value}
            style={style.value}
            onClick={handleClick}
          />
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
