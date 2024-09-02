function string2array(str) {
  if (str) {
    return JSON.parse(str)
  } else {
    return []
  }
}

function assembleUrl(urlHost, urlPath) {
  if (urlHost && urlPath) {
    return urlHost + urlPath
  } else {
    return null
  }
}
function assembleMarkerFilePropList(urlHost, listStr) {
  const jsonList = string2array(listStr)
  return jsonList.map((item) => {
    return [item[0], assembleUrl(urlHost, item[1])]
  })
}

function simplifyMarkerSymbol(markerSymbol, serverUrl) {
  const { markerFileType, markerFile, markerFileProp, markerFilePropList } = markerSymbol
  const completeMarkerFile = assembleUrl(serverUrl, markerFile)
  if (markerFileType === 'rule') {
    return {
      markerFile: {
        type: 'categorical',
        property: markerFileProp,
        stops: assembleMarkerFilePropList(markerFilePropList),
        default: completeMarkerFile
      }
    }
  } else {
    return { markerFile: completeMarkerFile }
  }
}

export function getBetterSymbol(originSymbol, options) {
  const { markerFileType, markerFile, markerFileProp, markerFilePropList, ...rest } = originSymbol
  const markerSymbol = simplifyMarkerSymbol(
    {
      markerFileType,
      markerFile,
      markerFileProp,
      markerFilePropList
    },
    options?.serverUrl
  )
  return {
    ...rest,
    ...markerSymbol
  }
}
