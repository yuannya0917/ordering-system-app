import { API_BASE_URL, rawApi } from '../request'

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

type SecurityQuestionResult = string | {
  securityQuestion?: string | null
  question?: string | null
}

function buildAuthPath(path: string) {
  return API_BASE_URL.replace(/\/+$/, '').endsWith('/api')
    ? path
    : `/api${path}`
}

export function changePassword(
  params: ChangePasswordByPasswordParams | ChangePasswordBySecurityParams,
) {
  return rawApi.put(buildAuthPath('/auth/updatePassword'), params)
}

export async function getSecurityQuestion(userId: string) {
  const result = await rawApi.get<SecurityQuestionResult>(
    buildAuthPath(`/auth/security-question/${encodeURIComponent(userId)}`),
  )

  if (result.code && result.code !== 0 && result.code !== 200) {
    throw new Error(result.message || result.msg || '获取密保问题失败')
  }

  const data = result.data
  if (typeof data === 'string') {
    return data
  }

  if (data && typeof data === 'object') {
    return data.securityQuestion || data.question || ''
  }

  return ''
}
