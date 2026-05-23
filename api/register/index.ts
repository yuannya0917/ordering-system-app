import { rawApi } from '../request'

export type UserType = 'customer' | 'admin'

export type CustomerRegisterParams = {
  userId: string
  userPassword: string
  userType: 'customer'
  securityQuestion: string
  securityAnswer: string
}

export type AdminRegisterParams = {
  userId: string
  userPassword: string
  userType: 'admin'
  merchantName: string
}

export type CustomerRegisterResult = {
  userId: string
  userType: UserType
  userPassword: string
  securityQuestion: string
  securityAnswer: string
}

export type AdminRegisterResult = {
  userId: string
  userPassword: string
  userType: UserType
  merchantName: string
}

export function customerRegister(params: CustomerRegisterParams) {
  return rawApi.post<CustomerRegisterResult>('/auth/register', params)
}

export function adminRegister(params: AdminRegisterParams) {
  return rawApi.post<AdminRegisterResult>('/auth/register', params)
}

