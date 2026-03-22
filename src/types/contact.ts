export interface SendContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

export interface SendContactResponse {
  message: string
}
