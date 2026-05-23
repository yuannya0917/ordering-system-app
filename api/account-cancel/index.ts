import { api } from '../request'

export type DeleteAccountParams = {
  userId: string
}

export function deleteAccount(params: DeleteAccountParams) {
  return api.delete('/account/delete', { params })
}
