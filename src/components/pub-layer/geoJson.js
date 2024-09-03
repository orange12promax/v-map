import { ref } from 'vue'
import { useFetch } from '@/services/common.js'

export function usePubGeoJsonLayer() {
  const fetchFeatureUrl = ref()
  const {
    isFinished: isFeatureFinished,
    execute: executeFetchFeature,
    data: featureData
  } = useFetch(fetchFeatureUrl)
  async function queryJson(id) {
    fetchFeatureUrl.value = `/wfs/get/${id}`
    executeFetchFeature()
  }
  return {
    queryJson,
    isFeatureFinished,
    featureData
  }
}
