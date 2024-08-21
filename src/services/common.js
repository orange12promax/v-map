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
