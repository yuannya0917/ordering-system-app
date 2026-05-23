import {api ,rawApi} from '../request'


export function updateInfo(params:any) {
  return api.put('/auth/update', params)
}

export function updatePassword(params:any) {
  return api.put('/auth/update', params)
}
