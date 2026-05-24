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

export type DeleteCommentParams = {
  commentId: string
  userId: string
}

export type DeleteCommentResult = {
  success: boolean
  message: string
}

export type CommentItem = {
  commentId: string
  orderId: string
  userId: string
  content: string
  publishTime: string
}


export function getAllComments() {
  return api.get<CommentItem[]>('/comment/admin/list')
}


export function deleteComment(params: DeleteCommentParams) {
  return api.delete<DeleteCommentResult>('/comment/delete', { params })
}


export function getMyReviews(userId: string) {
  return api.get<MyReviewItem[]>(`/comment/user/${userId}`)
}

export function addComment(params: AddCommentParams) {
  return api.post<AddCommentResult>('/comment/add', params)
}
