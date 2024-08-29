import { inject, ref, computed } from 'vue'

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
  const { serverUrl } = inject('parentMap')

  const data = ref(null)
  const coreData = computed(() => {
    if (data.value?.code === 200 && data.value?.data) {
      return data.value.data
    } else {
      return null
    }
  })

  function execute() {
    isFinished.value = false
    isFetching.value = true
    requestService({
      url: `${serverUrl.value}${url.value}`,
      method: 'GET'
    }).then((res) => {
      isFinished.value = true
      isFetching.value = false
      data.value = res
    })
  }

  return {
    isFinished,
    isFetching,
    execute,
    data,
    coreData
  }
}
