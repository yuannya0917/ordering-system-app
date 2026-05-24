import { api, rawApi, request } from '../request'

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

