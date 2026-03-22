import { post } from '@/utils/api'
import type { SendContactRequest, SendContactResponse } from '@/types/contact'

export const contactService = {
  send(payload: SendContactRequest): Promise<SendContactResponse> {
    return post<SendContactResponse>('/api/contact', payload)
  },
}
