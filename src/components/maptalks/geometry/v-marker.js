import { Marker } from '@/components/maptalks/module.js'
import { watch, inject, onBeforeUnmount, onMounted } from 'vue'

export default {
  name: 'VMarker',
  props: {
    id: String,
    coordinates: Array,
    options: Object
  },
  setup(props, context) {
    const { addGeometry } = inject('parentVectorLayer')
    let geo
    onMounted(() => {
      geo = new Marker(props.coordinates, { id: props.id, ...props.options })
      addGeometry(geo)
      geo.on('click', (e) => {
        context.emit('click', e)
      })
    })
    onBeforeUnmount(() => {
      if (geo) {
        geo.remove()
      }
    })

    watch(
      () => props.coordinates,
      () => {
        if (geo) {
          geo.setCoordinates(props.coordinates)
        }
      }
    )
    watch(
      () => props.options,
      () => {
        if (geo) {
          geo.setOptions(props.options)
        }
      }
    )
    return () => null
  }
}
