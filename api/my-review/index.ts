import { api } from '../request'

export type MyReviewItem = {
  commentId: string
  orderId: string
  userId: string
  content: string
  publishTime: string
}

export type AddCommentParams = {
  orderId: string
  userId: string
  content: string
}

export type AddCommentResult = {
  success: boolean
  commentId?: string
  message?: string
}

export function getMyReviews(userId: string) {
  return api.get<MyReviewItem[]>(`/comment/user/${userId}`)
}

export function addComment(params: AddCommentParams) {
  return api.post<AddCommentResult>('/comment/add', params)
}
