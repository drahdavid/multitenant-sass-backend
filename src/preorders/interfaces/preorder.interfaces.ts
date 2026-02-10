export interface WhatsAppPayload {
  phone: string;
  message: string;
}

export interface PreOrderResponse {
  preorderId: string;
  whatsapp: WhatsAppPayload;
}
