import {api ,rawApi} from '../request'


export function forgotPassword(params:any) {
  return rawApi.put('/account/forgotPassword', params)
}

export function getInfo(params:any) {
  return rawApi.put('/auth/info', params)
}
