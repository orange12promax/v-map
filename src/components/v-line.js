import { useMapLife, useVectorLayer } from './common'
import { Line } from './maptalks'
import { onBeforeUnmount } from 'vue'

export default {
  name: 'VLine',
  props: {
    coor: Array,
    symbol: Object
  },
  setup(props) {
    const { onMapMounted } = useMapLife()
    const { addVector } = useVectorLayer()
    let instance
    onMapMounted(() => {
      instance = new Line(props.coor, {
        symbol: props.symbol
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
