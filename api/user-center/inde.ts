import { rawApi } from '../request'

export type UserType = 'customer' | 'admin'

export type GetUserInfoParams = {
  userId: string
  currentUserId: string
}

export type UserInfo = {
  userId: string
  username: string
  userType: UserType
  securityQuestion: string | null
  securityAnswer: string | null
  merchantName: string | null
  totalAmount: number
  orderCount: number
  orderIds: string[]
}

export function getUserInfo(params: GetUserInfoParams) {
  return rawApi.get<UserInfo>('/auth/info', { params })
}
