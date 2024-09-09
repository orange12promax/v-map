import { stringify } from '../../utils'

export const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

export function getTiandituUrl(options) {
  const { layer, tileMatrixSet } = options
  return `https://t{s}.tianditu.gov.cn/${layer}_${tileMatrixSet}/wmts?${stringify({
    SERVICE: 'WMTS',
    REQUEST: 'GetTile',
    VERSION: '1.0.0',
    STYLE: 'default',
    FORMAT: 'tiles',
    TILEMATRIX: '{z}',
    TILECOL: '{x}',
    TILEROW: '{y}',
    tk: '{token}',
    LAYER: layer,
    TILEMATRIXSET: tileMatrixSet
  })}`
}

export function getAnnotationByName(name) {
  switch (name) {
    case 'vec':
      return 'cva'
    case 'img':
      return 'cia'
    case 'ter':
      return 'cta'
    default:
      return null
  }
}
