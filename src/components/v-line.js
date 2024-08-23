import { useVectorLayer } from './common/common.js'
import { Line } from './common/maptalks.js'
import { onBeforeUnmount, onMounted } from 'vue'

export default {
  name: 'VLine',
  props: {
    coor: Array,
    symbol: Object
  },
  setup(props, context) {
    const { addVector } = useVectorLayer()
    let instance
    onMounted(() => {
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
