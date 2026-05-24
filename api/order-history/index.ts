import { api } from '../request'

export type OrderStatusCode = '0' | '1' | '2'

export type OrderHistoryItem = {
  orderId: string
  userId: string
  orderPrice: number
  orderTime: string
  orderNote: string
  orderStatus: OrderStatusCode
}

export type OrderDetailItem = {
  orderId: string
  dishId: string
  dishName: string
  dishNum: number
  dishPrice: number
  totalPrice: number
}

export function getOrderHistory(userId: string) {
  return api.get<OrderHistoryItem[]>(`/order/history/${userId}`)
}

export function getOrderDetails(orderId: string) {
  return api.get<OrderDetailItem[]>(`/orderdetail/list/${orderId}`)
}
