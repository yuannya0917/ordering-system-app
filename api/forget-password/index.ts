import { rawApi } from '../request'

export type VerifyType = 'password' | 'security'

export type ForgetPasswordByPasswordParams = {
  userId: string
  verifyType: 'byow'
  oldPassword: string
  newPassword: string
}

export type ForgetPasswordBySecurityParams = {
  userId: string
  verifyType: 'sc'
  securityAnswer: string
  newPassword: string
}

export function forgotPassword(
  params: ForgetPasswordByPasswordParams | ForgetPasswordBySecurityParams,
) {
  return rawApi.put('/account/forgotPassword', params)
}
