import {api ,rawApi} from '../request'


export function forgotPassword(params:any) {
  return api.delete('/account/forgotPassword', params)
}
