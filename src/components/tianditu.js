import { stringify } from 'qs'

export const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

export function getTiandituUrl(options) {
  const { layer, tileMatrixSet, ...rest } = options
  return `https://t{s}.tianditu.gov.cn/${layer}_${tileMatrixSet}/wmts?${stringify(
    {
      SERVICE: 'WMTS',
      REQUEST: 'GetTile',
      VERSION: '1.0.0',
      STYLE: 'default',
      FORMAT: 'tiles',
      TILEMATRIX: '{z}',
      TILECOL: '{x}',
      TILEROW: '{y}',
      tk: import.meta.env.VITE_TIANDITU_TK,
      LAYER: layer,
      TILEMATRIXSET: tileMatrixSet,
      ...rest
    },
    { encode: false }
  )}`
}
