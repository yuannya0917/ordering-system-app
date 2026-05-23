import { rawApi } from '../request'

export type VerifyType = 'password' | 'security'

export type ChangePasswordByPasswordParams = {
  userId: string
  verifyType: 'password'
  oldPassword: string
  newPassword: string
}

export type ChangePasswordBySecurityAnswerParams = {
  userId: string
  verifyType: 'security'
  securityAnswer: string
  newPassword: string
}

export function changePassword(
  params: ChangePasswordByPasswordParams | ChangePasswordBySecurityAnswerParams,
) {
  return rawApi.put('/auth/updatePassword', params)
}
