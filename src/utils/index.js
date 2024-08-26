import { v4 as uuidv4 } from 'uuid'

export function stringify(obj) {
  if (!obj) return ''
  return Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join('&')
}

export function getUuid() {
  return uuidv4()
}
