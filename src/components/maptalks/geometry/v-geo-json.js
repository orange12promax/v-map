import { inject, onBeforeUnmount, onMounted, ref, watch, defineExpose } from 'vue'
import { useFetch } from '@/services/common.js'
import { GeoJSON } from '@/components/maptalks/module'

export default {
  name: 'VGeoJson',
  props: {
    id: String
  },
  setup(props) {
    const { addGeometry } = inject('parentVectorLayer')
    const fetchFeatureUrl = ref()

    function geoJsonToGeometry(json) {
      const { features, ...rest } = json

      const validFeatures = features.filter((item) => !!item.geometry)
      const validJson = {
        features: validFeatures,
        ...rest
      }
      return GeoJSON.toGeometry(validJson)
    }

    const { execute, data } = useFetch(fetchFeatureUrl)
    let geometries = []
    function addGeometries(list) {
      console.log(list)
      if (list && list.length > 0) {
        addGeometry(list)
        geometries = list
      }
    }
    function removeGeometries() {
      geometries.forEach((item) => {
        item.remove()
      })
      geometries = []
    }
    watch(data, (nv) => {
      removeGeometries()
      if (data) {
        addGeometries(geoJsonToGeometry(nv))
      }
    })

    onMounted(() => {
      fetchFeatureUrl.value = `/wfs/get/${props.id}`
      execute()
    })
    onBeforeUnmount(() => {
      removeGeometries()
    })

    defineExpose({
      data
    })

    return () => null
  }
}
