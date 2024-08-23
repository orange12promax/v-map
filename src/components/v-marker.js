import { useVectorLayer } from './common/common.js'
import { Marker } from './common/maptalks.js'
import { onBeforeUnmount, onMounted } from 'vue'

export default {
  name: 'VMarker',
  props: {
    coor: Array,
    symbol: Object,
    properties: Object
  },
  setup(props, context) {
    const { addVector } = useVectorLayer()
    let instance
    onMounted(() => {
      instance = new Marker(props.coor, {
        symbol: props.symbol,
        properties: props.properties
      })
      instance.on('click', (e) => {
        context.emit('click', e)
      })
      addVector(instance)
    })
    onBeforeUnmount(() => {
      instance.remove()
    })
    return () => null
  }
}
