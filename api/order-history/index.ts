import { api, WS_URL } from '../request'

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

export type UserOrderStatusChangeNotice = {
  orderId: string
  oldStatus: OrderStatusCode
  newStatus: OrderStatusCode
  message: string
}

type SubscribeUserOrderStatusChangesParams = {
  userId: string
  onMessage: (payload: UserOrderStatusChangeNotice) => void
  onError?: (error: unknown) => void
}

function buildStompFrame(command: string, headers: Record<string, string>, body = '') {
  const headerText = Object.entries(headers)
    .map(([key, value]) => `${key}:${value}`)
    .join('\n')

  return `${command}\n${headerText}\n\n${body}\u0000`
}

function parseStompBody(frame: string) {
  const bodyStartIndex = frame.indexOf('\n\n')
  if (bodyStartIndex < 0) {
    return ''
  }

  const rawBody = frame.slice(bodyStartIndex + 2)
  return rawBody.replace(/\u0000/g, '').trim()
}

function getHostFromWsUrl(wsUrl: string) {
  try {
    return new URL(wsUrl).host
  } catch {
    return ''
  }
}

export function subscribeUserOrderStatusChanges({
  userId,
  onMessage,
  onError,
}: SubscribeUserOrderStatusChangesParams) {
  const ws = new WebSocket(WS_URL)
  const subscriptionId = `user-order-status-${userId}-${Date.now()}`
  let isConnected = false
  let shouldCloseAfterOpen = false

  ws.onopen = () => {
    if (shouldCloseAfterOpen) {
      ws.close()
      return
    }

    ws.send(
      buildStompFrame('CONNECT', {
        'accept-version': '1.2',
        'heart-beat': '0,0',
        host: getHostFromWsUrl(WS_URL),
      }),
    )
  }

  ws.onmessage = (event) => {
    const frame = String(event.data || '')

    if (frame.startsWith('CONNECTED')) {
      isConnected = true
      ws.send(
        buildStompFrame('SUBSCRIBE', {
          id: subscriptionId,
          destination: `/topic/user/${userId}/order-status`,
        }),
      )
      return
    }

    if (!frame.startsWith('MESSAGE')) {
      if (frame.startsWith('ERROR')) {
        const errorBody = parseStompBody(frame) || 'STOMP broker rejected CONNECT/SUBSCRIBE'
        onError?.(new Error(errorBody))
      }
      return
    }

    try {
      const payload = JSON.parse(parseStompBody(frame)) as UserOrderStatusChangeNotice
      onMessage(payload)
    } catch {
      // Ignore malformed messages to keep subscription alive.
    }
  }

  ws.onerror = (error) => {
    onError?.(error)
  }

  ws.onclose = (event) => {
    if (!event.wasClean) {
      onError?.(event)
    }
  }

  return () => {
    shouldCloseAfterOpen = true
    if (isConnected && ws.readyState === WebSocket.OPEN) {
      ws.send(
        buildStompFrame('UNSUBSCRIBE', {
          id: subscriptionId,
        }),
      )
      ws.send(buildStompFrame('DISCONNECT', {}))
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.close()
    }
  }
}

export function formatUserOrderStatusWsError(error: unknown) {
  if (error && typeof error === 'object') {
    const maybeEvent = error as {
      code?: number
      reason?: string
      message?: string
      type?: string
    }

    const codeText = typeof maybeEvent.code === 'number' ? ` code=${maybeEvent.code}` : ''
    const reasonText = maybeEvent.reason ? ` reason=${maybeEvent.reason}` : ''
    const messageText = maybeEvent.message ? ` message=${maybeEvent.message}` : ''
    const typeText = maybeEvent.type ? ` type=${maybeEvent.type}` : ''
    const details = `${codeText}${reasonText}${messageText}${typeText}`.trim()
    const code = maybeEvent.code
    if (code === 1000) {
      return 'WebSocket 连接已正常关闭'
    }
    return details ? `WebSocket 连接异常:${details}` : 'WebSocket 连接异常'
  }

  if (error instanceof Error) {
    return `WebSocket 连接异常: ${error.message}`
  }

  return 'WebSocket 连接异常'
}

export function getOrderHistory(userId: string) {
  return api.get<OrderHistoryItem[]>(`/order/history/${userId}`)
}

export function getOrderDetails(orderId: string) {
  return api.get<OrderDetailItem[]>(`/orderdetail/list/${orderId}`)
}
