import { rawApi } from '../request'

export type CartItem = {
  dishId: string
  dishName: string
  dishPrice: number
  dishNum: number
  totalPrice: number
}

export type CartData = {
  items: CartItem[]
  totalPrice: number
}

export type AddCartParams = {
  userId: string
  dishId: string
  dishName: string
  dishPrice: number
  dishNum: number
}

export type RemoveCartItemParams = {
  userId: string
  dishId: string
}

export type SubmitOrderParams = {
  userId: string
  orderNote?: string
}

export type SubmitOrderResult = {
  orderId: string
  userId: string
  orderPrice: number
  orderTime: string
  orderNote?: string | null
  orderStatus: string
}

export function addCart(params: AddCartParams) {
  return rawApi.post<null>('/order/cart/add', params)
}

export function getCart(userId: string) {
  return rawApi.get<CartData | boolean>(`/order/cart/${userId}`)
}

export function removeCartItem(params: RemoveCartItemParams) {
  return rawApi.delete<null>('/order/cart/remove', { body: params })
}

export function submitOrder(params: SubmitOrderParams) {
  return rawApi.post<SubmitOrderResult>('/order/submit', params)
}
