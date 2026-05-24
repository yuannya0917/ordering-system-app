import { requestRaw } from '../request'

export type DeleteAccountParams = {
  userId: string
  currentUserId: string
}

export function deleteAccount(params: DeleteAccountParams) {
  return requestRaw<null>('/auth/delete', {
    method: 'DELETE',
    body: params,
  })
}
