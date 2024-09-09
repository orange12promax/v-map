import { TileLayer } from '@/components/maptalks/module.js'
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { getUuid } from '@/utils'

export default {
  name: 'VTileLayer',
  props: {
    urlTemplate: String,
    subdomains: Array,
    zIndex: Number,
    token: String
  },
  setup(props) {
    let uid = getUuid()
    const parentMap = inject('parentMap')
    const parentGroup = inject('parentGroupTileLayer')

    function createLayer() {
      return new TileLayer(uid, {
        urlTemplate: props.urlTemplate,
        subdomains: props.subdomains,
        zIndex: props.zIndex,
        token: props.token
      })
    }
    //  Add the layer to the map or group
    function addLayerToMap(layer) {
      if (parentMap?.addLayer && layer) {
        parentMap.addLayer(layer)
      }
    }
    function addLayerToGroup(layer) {
      if (parentGroup?.addChildLayer && layer) {
        parentGroup.addChildLayer([layer])
      }
    }
    function addLayer(layer) {
      if (parentGroup) {
        addLayerToGroup(layer)
      } else {
        addLayerToMap(layer)
      }
    }
    // Remove the layer from the map or group
    function removeLayerFromMap(layer) {
      if (layer?.remove) {
        layer.remove()
      }
    }
    function removeLayerFromGroup(layer) {
      if (parentGroup?.removeChildLayer && layer) {
        parentGroup.removeChildLayer([layer])
      }
    }
    function removeLayer(layer) {
      if (parentGroup) {
        removeLayerFromGroup(layer)
      }
      removeLayerFromMap(layer)
    }
    let tileLayer
    onMounted(() => {
      tileLayer = createLayer()
      addLayer(tileLayer)
    })
    onBeforeUnmount(() => {
      removeLayer(tileLayer)
    })
    return () => null
  }
}
