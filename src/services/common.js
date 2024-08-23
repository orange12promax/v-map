import { inject, ref, onMounted } from 'vue'
import { mapServer } from '@/components/common/config.js'

export function requestService({ url, method, data }) {
  return new Promise((resolve, reject) => {
    let finalData = null
    if (data) {
      finalData = { ...data }
    } else {
      finalData = {}
    }

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    if (method === 'POST' && finalData) {
      options.body = JSON.stringify(finalData)
    }
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function useFetch(url) {
  const isFinished = ref(false)
  const isFetching = ref(false)
  const mapServerUrl = inject(mapServer)

  const data = ref(null)

  function execute() {
    isFinished.value = false
    isFetching.value = true
    requestService({
      url: `${mapServerUrl.value}${url.value}`,
      method: 'GET'
    }).then((res) => {
      isFinished.value = true
      isFetching.value = false
      if (res.code === 200 && res.data) {
        data.value = res.data
      } else {
        data.value = null
      }
    })
  }

  return {
    isFinished,
    isFetching,
    execute,
    data
  }
}
