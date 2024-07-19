import { requestService } from './common'

export function getStyle(name) {
  return requestService({
    url: `/style/get/${name}`,
    method: 'GET'
  })
}
