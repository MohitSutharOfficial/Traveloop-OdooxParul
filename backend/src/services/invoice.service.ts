import { supabaseAdmin } from '../config/supabase';
import { Invoice, InvoiceItem, CreateInvoiceRequest, UpdateInvoiceRequest } from '../types';

export class InvoiceService {
  static async listByTrip(tripId: string) {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<(Invoice & { invoice_items: InvoiceItem[] }) | null> {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(payload: CreateInvoiceRequest): Promise<Invoice> {
    const { items, ...invoiceData } = payload;

    // Create the invoice
    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single();
    if (error) throw error;

    // Create invoice items if provided
    if (items && items.length > 0) {
      const itemsWithInvoiceId = items.map((item) => ({
        ...item,
        invoice_id: invoice.id,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('invoice_items')
        .insert(itemsWithInvoiceId);
      if (itemsError) throw itemsError;
    }

    return invoice;
  }

  static async update(id: string, payload: UpdateInvoiceRequest): Promise<Invoice> {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    // invoice_items are CASCADE deleted
    const { error } = await supabaseAdmin
      .from('invoices')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  /** Add a line item to an existing invoice */
  static async addItem(invoiceId: string, description: string, amount: number): Promise<InvoiceItem> {
    const { data, error } = await supabaseAdmin
      .from('invoice_items')
      .insert({ invoice_id: invoiceId, description, amount })
      .select()
      .single();
    if (error) throw error;

    // Recalculate total
    await this.recalculateTotal(invoiceId);
    return data;
  }

  /** Remove a line item */
  static async removeItem(itemId: string, invoiceId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('invoice_items')
      .delete()
      .eq('id', itemId);
    if (error) throw error;

    await this.recalculateTotal(invoiceId);
  }

  /** Recalculate invoice total from its line items */
  private static async recalculateTotal(invoiceId: string): Promise<void> {
    const { data: items, error: fetchErr } = await supabaseAdmin
      .from('invoice_items')
      .select('amount')
      .eq('invoice_id', invoiceId);
    if (fetchErr) throw fetchErr;

    const total = (items || []).reduce((sum, item) => sum + Number(item.amount), 0);

    const { error } = await supabaseAdmin
      .from('invoices')
      .update({ total })
      .eq('id', invoiceId);
    if (error) throw error;
  }
}
