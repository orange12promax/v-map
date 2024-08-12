import { useMapLife, useVectorLayer } from './common'
import { Marker } from './maptalks'
import { onBeforeUnmount } from 'vue'

export default {
  name: 'VMarker',
  props: {
    coor: Array,
    symbol: Object,
    properties: Object
  },
  setup(props, context) {
    const { onMapMounted } = useMapLife()
    const { addVector } = useVectorLayer()
    let instance
    onMapMounted(() => {
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
