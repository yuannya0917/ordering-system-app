import { API_BASE_URL, api, rawApi, request } from '../request'

export type MenuItem = {
  menuId: string
  menuName: string
  cover?: string | null
  remark?: string | null
  createTime?: string | null
}

export type GetMenuListParams = {
  menuName?: string
}

export type AddMenuParams = {
  menuId: string
  menuName: string
  remark?: string
  createTime?: string
}

export type DeleteMenuParams = {
  menuId: string
}

export type UpdateMenuParams = {
  menuId: string
  menuName: string
  remark?: string
}

export function getMenuList(params?: GetMenuListParams) {
  return api.get<MenuItem[]>('/menu/list', { params })
}

export function addMenu(params: AddMenuParams) {
  return api.post<boolean>('/menu/add', params)
}

export function updateMenu(params: UpdateMenuParams) {
  return api.put<boolean>('/menu/update', params)
}

export function deleteMenu(params: DeleteMenuParams) {
  return request<boolean>('/menu/delete', {
    method: 'DELETE',
    body: params,
  })
}

//////////////////////////////////////////////////////////

export type DishItem = {
  dishId: string
  dishName: string
  dishPrice: number
  dishIntroduction?: string | null
  menuId?: string | null
  menuName?: string | null
  dishImage?: string | null
}

export type GetDishListParams = {
  dishId?: string
  dishName?: string
  menuId?: string
}

export type AddDishParams = {
  dishId: string
  dishName: string
  dishPrice: string
  dishIntroduction?: string
  menuId: string
}

export type UpdateDishParams = AddDishParams

export type DeleteDishParams = {
  dishId: string
}

export function getDishList(params?: GetDishListParams) {
  return api.get<DishItem[]>('/dish/list', { params })
}

export function addDish(params: AddDishParams) {
  return api.post<boolean>('/dish/add', params)
}

export function updateDish(params: UpdateDishParams) {
  return api.put<null>('/dish/update', params)
}

export function deleteDish(params: DeleteDishParams) {
  return request<null>('/dish/delete', {
    method: 'DELETE',
    body: params,
  })
}

//////////////////////////////////////////////////////////

export type AddCollectParams = {
  userId: string
  dishId: string
  linkUrl?: string
}

export type AddCollectResult = {
  collectId: string
}

export type DeleteCollectParams = {
  userId: string
  dishId: string
}

export type DeleteCollectResult = {
  success: boolean
  message?: string
}

export type CollectItem = {
  collectId: string
  dishId: string
  linkUrl?: string | null
  userId: string
  collectTime: string
}

export type GetCollectListParams = {
  userId: string
}

export type CheckCollectParams = {
  userId: string
  dishId: string
}

export function addCollect(params: AddCollectParams) {
  return rawApi.post<AddCollectResult>('/collect/add', params)
}

export function deleteCollect(params: DeleteCollectParams) {
  return request<DeleteCollectResult>('/collect/cancel', {
    method: 'DELETE',
    params,
  })
}

export function getCollectList(params: GetCollectListParams) {
  return api.get<CollectItem[]>('/collect/list', { params })
}

export function checkCollect(params: CheckCollectParams) {
  return request<boolean>('/collect/check', {
    method: 'GET',
    params,
  })
}

//////////////////////////////////////////////////////////

export type AdminCommentItem = {
  commentId: string
  orderId: string
  userId: string
  content: string
  publishTime: string
}

export type OrderDetailItem = {
  orderId: string
  dishId: string
  dishName: string
  dishNum: number
  dishPrice: number
  totalPrice: number
}

export type CommentLikeParams = {
  commentId: string
  userId: string
}

export type CommentLikeResult = {
  success: boolean
  message?: string
}

export type CommentLikeCheckResult = {
  liked: boolean
}

function getServiceBaseUrl() {
  return API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '')
}

const COMMENT_ADMIN_LIST_URL =
  process.env.EXPO_PUBLIC_COMMENT_ADMIN_LIST_URL ||
  `${getServiceBaseUrl()}/comment/admin/list`

function normalizeLikeCount(result: unknown) {
  if (typeof result === 'number') {
    return result
  }

  if (result && typeof result === 'object') {
    const value = result as {
      count?: number
      likeCount?: number
      likes?: number
      total?: number
    }

    return Number(value.count ?? value.likeCount ?? value.likes ?? value.total ?? 0)
  }

  return 0
}

export function getAllComments() {
  return api.get<AdminCommentItem[]>('/comment/admin/list')
}

export function getOrderDetails(orderId: string) {
  return api.get<OrderDetailItem[]>(`/orderdetail/list/${orderId}`)
}

export function addCommentLike(params: CommentLikeParams) {
  return api.post<CommentLikeResult>('/like/add', undefined, {
    params: {
      commentid: params.commentId,
      userid: params.userId,
    },
  })
}

export async function getCommentLikeCount(commentId: string) {
  const result = await request<unknown>(`/like/count/${commentId}`)
  return normalizeLikeCount(result)
}

export function checkCommentLiked(params: CommentLikeParams) {
  return api.get<CommentLikeCheckResult>('/like/check', {
    params: {
      commentid: params.commentId,
      userid: params.userId,
    },
  })
}

export function cancelCommentLike(params: CommentLikeParams) {
  return request<CommentLikeResult>('/like/cancel', {
    method: 'DELETE',
    params: {
      commentid: params.commentId,
      userid: params.userId,
    },
  })
}

