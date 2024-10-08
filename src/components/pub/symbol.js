function string2array(str) {
  if (str) {
    return JSON.parse(str)
  } else {
    return []
  }
}

function assembleUrl(urlHost, urlPath) {
  if (urlHost && urlPath) {
    // 判断urlHost是否以http开头
    if (urlHost.startsWith('http')) {
      return urlHost + urlPath
    } else {
      return location.origin + urlHost + urlPath
    }
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
        stops: assembleMarkerFilePropList(serverUrl, markerFilePropList),
        default: completeMarkerFile
      }
    }
  } else {
    return { markerFile: completeMarkerFile }
  }
}

export function getBetterSymbol(originSymbol, options) {
  if (originSymbol) {
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
  return null
}
