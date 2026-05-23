import {api ,rawApi} from '../request'

export type UserType = 'customer' | 'admin'



export function customerRegister(params:any) {
  return rawApi.post('/auth/register', params)
}

