function string2array(str) {
  if (str) {
    return JSON.parse(str)
  } else {
    return []
  }
}

function simplifyMarkerSymbol(originSymbol) {
  const { markerFileType, markerFile, markerFileProp, markerFilePropList, ...rest } = originSymbol
  if (markerFileType === 'rule') {
    return {
      markerFile: {
        type: 'categorical',
        property: markerFileProp,
        stops: string2array(markerFilePropList),
        default: markerFile
      },
      ...rest
    }
  } else {
    return { markerFile, ...rest }
  }
}

export function getBetterSymbol(originSymbol) {
  return simplifyMarkerSymbol(originSymbol)
}
