import VMarker from '../maptalks/geometry/v-marker.js'
import VLine from '../maptalks/geometry/v-line.js'
import VPolygon from '../maptalks/geometry/v-polygon.js'

export default {
  name: 'VPuaItem',
  props: {
    type: String,
    id: String,
    coordinates: Array,
    options: Object
  },
  emits: ['click'],
  setup(props, context) {
    function handleItemClick(e) {
      context.emit('click', e)
    }
    return () => {
      switch (props.type) {
        case 'line':
          return (
            <VLine
              id={props.id}
              coordinates={props.coordinates}
              options={props.options}
              onClick={handleItemClick}
            />
          )
        case 'fill':
          return (
            <VPolygon
              id={props.id}
              coordinates={props.coordinates}
              options={props.options}
              onClick={handleItemClick}
            />
          )
        case 'point':
          return (
            <VMarker
              id={props.id}
              coordinates={props.coordinates}
              options={props.options}
              onClick={handleItemClick}
            />
          )
        default:
          return null
      }
    }
  }
}
