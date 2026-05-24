import { API_BASE_URL, rawApi } from '../request'

export type ForgetPasswordParams = {
  userId: string
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

export function forgotPassword(
  params: ForgetPasswordParams,
) {
  return rawApi.put('/auth/forgotPassword', params)
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
