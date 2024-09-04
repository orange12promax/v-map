import { useFetch } from '@/services/common.js'
import { ref, computed } from 'vue'

export function useWfsService() {
  const fetchFeatureUrl = ref()
  const { execute, data } = useFetch(fetchFeatureUrl)
  function queryFeatures(layerId) {
    fetchFeatureUrl.value = `/wfs/get/${layerId}`
    execute()
  }
  const features = computed(() => {
    if (data.value?.features && data.value.features.length > 0) {
      return data.value.features.filter((item) => !!item.geometry)
    }
    return []
  })
  return {
    queryFeatures,
    features
  }
}
