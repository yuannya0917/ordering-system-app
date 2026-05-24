import { rawApi } from '../request'

export type ChangePasswordByPasswordParams = {
  userId: string
  verifyType: 'password'
  oldPassword: string
  newPassword: string
}

export type ChangePasswordBySecurityParams = {
  userId: string
  verifyType: 'security'
  securityAnswer: string
  newPassword: string
}

export function changePassword(
  params: ChangePasswordByPasswordParams | ChangePasswordBySecurityParams,
) {
  return rawApi.put('/auth/updatePassword', params)
}
