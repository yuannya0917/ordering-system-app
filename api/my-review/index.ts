import { api } from '../request'

export type MyReviewItem = {
  commentId: string
  orderId: string
  userId: string
  content: string
  publishTime: string
}

export function getMyReviews(userId: string) {
  return api.get<MyReviewItem[]>(`/comment/user/${userId}`)
}
