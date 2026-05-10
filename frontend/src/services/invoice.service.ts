import api from './api';

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'void';

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface Invoice {
  id: string;
  trip_id: string;
  invoice_number: string;
  currency: string;
  status: InvoiceStatus;
  total: number;
  issued_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  invoice_items?: InvoiceItem[];
}

export interface CreateInvoiceRequest {
  invoice_number: string;
  currency?: string;
  status?: InvoiceStatus;
  issued_at?: string | null;
  items?: { description: string; amount: number }[];
}

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus;
  total?: number;
  issued_at?: string | null;
  paid_at?: string | null;
}

export const invoiceService = {
  getInvoices: async (tripId: string): Promise<Invoice[]> => {
    const response = await api.get(`/invoices/trip/${tripId}`);
    return response.data.data || [];
  },

  getInvoice: async (tripId: string, invoiceId: string): Promise<Invoice> => {
    const response = await api.get(`/invoices/${invoiceId}`);
    return response.data.data;
  },

  createInvoice: async (tripId: string, invoiceData: CreateInvoiceRequest): Promise<Invoice> => {
    const response = await api.post(`/invoices`, { trip_id: tripId, ...invoiceData });
    return response.data.data;
  },

  updateInvoice: async (_tripId: string, invoiceId: string, invoiceData: UpdateInvoiceRequest): Promise<Invoice> => {
    const response = await api.patch(`/invoices/${invoiceId}`, invoiceData);
    return response.data.data;
  },

  addInvoiceItem: async (invoiceId: string, payload: { description: string; amount: number }): Promise<InvoiceItem> => {
    const response = await api.post(`/invoices/${invoiceId}/items`, payload);
    return response.data.data;
  },

  removeInvoiceItem: async (invoiceId: string, itemId: string): Promise<void> => {
    await api.delete(`/invoices/${invoiceId}/items/${itemId}`);
  },

  deleteInvoice: async (_tripId: string, invoiceId: string): Promise<void> => {
    await api.delete(`/invoices/${invoiceId}`);
  }
};
