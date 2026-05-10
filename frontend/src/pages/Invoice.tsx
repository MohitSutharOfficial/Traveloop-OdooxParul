import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Plus,
  Receipt,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  invoiceService,
  Invoice as InvoiceType,
  InvoiceStatus,
} from '../services/invoice.service';
import { useTripStore } from '../store/tripStore';
import { dateUtils } from '../utils/dateUtils';

interface InvoiceFormState {
  invoice_number: string;
  currency: string;
  status: InvoiceStatus;
  issued_at: string;
}

interface ItemFormState {
  category: string;
  description: string;
  qty_details: string;
  unit_cost: string;
  amount: string;
}

interface DisplayInvoiceItem {
  id: string;
  category: string;
  description: string;
  qtyDetails: string;
  unitCost: number;
  amount: number;
}

const ITEM_META_PREFIX = 'TLITEM:';

const createInvoiceNumber = () =>
  `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const formatMoney = (value: number, currency: string) =>
  `${currency} ${Number(value || 0).toFixed(2)}`;

const encodeItemDescription = (payload: {
  category: string;
  description: string;
  qtyDetails: string;
  unitCost: number;
}) => `${ITEM_META_PREFIX}${encodeURIComponent(JSON.stringify(payload))}`;

const parseInvoiceItem = (
  item: { id: string; description: string; amount: number }
): DisplayInvoiceItem => {
  const fallback: DisplayInvoiceItem = {
    id: item.id,
    category: 'General',
    description: item.description,
    qtyDetails: '1',
    unitCost: Number(item.amount || 0),
    amount: Number(item.amount || 0),
  };

  if (!item.description.startsWith(ITEM_META_PREFIX)) {
    return fallback;
  }

  try {
    const raw = item.description.slice(ITEM_META_PREFIX.length);
    const parsed = JSON.parse(decodeURIComponent(raw));
    return {
      id: item.id,
      category: String(parsed.category || 'General'),
      description: String(parsed.description || ''),
      qtyDetails: String(parsed.qtyDetails || '1'),
      unitCost: Number(parsed.unitCost || item.amount || 0),
      amount: Number(item.amount || 0),
    };
  } catch {
    return fallback;
  }
};

const statusClassMap: Record<InvoiceStatus, string> = {
  draft: 'odoo-badge-neutral',
  issued: 'odoo-badge-warning',
  paid: 'odoo-badge-success',
  void: 'odoo-badge-danger',
};

const statusLabelMap: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  issued: 'Issued',
  paid: 'Paid',
  void: 'Void',
};

export default function Invoice() {
  const { trips, fetchTrips } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | InvoiceStatus>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceFormState>({
    invoice_number: createInvoiceNumber(),
    currency: 'INR',
    status: 'issued',
    issued_at: new Date().toISOString().slice(0, 10),
  });
  const [itemForm, setItemForm] = useState<ItemFormState>({
    category: 'General',
    description: '',
    qty_details: '1',
    unit_cost: '',
    amount: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0].id);
    }
  }, [trips, selectedTrip]);

  const loadInvoices = async (tripId: string, keepSelection?: string | null) => {
    setLoading(true);
    try {
      const data = await invoiceService.getInvoices(tripId);
      setInvoices(data);
      if (data.length === 0) {
        setSelectedInvoiceId(null);
      } else if (keepSelection && data.some((invoice) => invoice.id === keepSelection)) {
        setSelectedInvoiceId(keepSelection);
      } else {
        setSelectedInvoiceId(data[0].id);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTrip) {
      setInvoices([]);
      setSelectedInvoiceId(null);
      return;
    }
    loadInvoices(selectedTrip);
  }, [selectedTrip]);

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    let next = invoices.filter((invoice) => {
      if (filterStatus !== 'all' && invoice.status !== filterStatus) return false;
      if (search && !invoice.invoice_number.toLowerCase().includes(search)) return false;
      return true;
    });

    if (sortBy === 'newest') {
      next = [...next].sort(
        (a, b) =>
          new Date(b.issued_at || b.created_at).getTime() -
          new Date(a.issued_at || a.created_at).getTime()
      );
    } else if (sortBy === 'oldest') {
      next = [...next].sort(
        (a, b) =>
          new Date(a.issued_at || a.created_at).getTime() -
          new Date(b.issued_at || b.created_at).getTime()
      );
    } else if (sortBy === 'highest') {
      next = [...next].sort((a, b) => Number(b.total) - Number(a.total));
    } else {
      next = [...next].sort((a, b) => Number(a.total) - Number(b.total));
    }

    return next;
  }, [invoices, searchTerm, filterStatus, sortBy]);

  const selectedInvoice =
    filteredInvoices.find((invoice) => invoice.id === selectedInvoiceId) ||
    invoices.find((invoice) => invoice.id === selectedInvoiceId) ||
    null;

  const selectedDisplayItems = useMemo(
    () => (selectedInvoice?.invoice_items || []).map((item) => parseInvoiceItem(item)),
    [selectedInvoice]
  );

  const trip = trips.find((t) => t.id === selectedTrip);
  const totalBudget = trip?.budget.total || 0;
  const spentBudget = trip?.budget.spent || 0;
  const remainingBudget = totalBudget - spentBudget;
  const spentRatio = totalBudget > 0 ? Math.min((spentBudget / totalBudget) * 100, 100) : 0;

  const totalInvoicesAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total || 0),
    0
  );
  const pendingAmount = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

  const subtotal = Number(selectedInvoice?.total || 0);
  const tax = subtotal * 0.05;
  const discount = 0;
  const grandTotal = subtotal + tax - discount;
  const currency = selectedInvoice?.currency || 'USD';

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setInvoiceForm({
      invoice_number: createInvoiceNumber(),
      currency: 'INR',
      status: 'issued',
      issued_at: new Date().toISOString().slice(0, 10),
    });
  };

  const closeItemModal = () => {
    setShowAddItemModal(false);
    setItemForm({
      category: 'General',
      description: '',
      qty_details: '1',
      unit_cost: '',
      amount: '',
    });
  };

  const handleCreateInvoice = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTrip || !invoiceForm.invoice_number.trim()) return;

    setSubmitting(true);
    try {
      const created = await invoiceService.createInvoice(selectedTrip, {
        invoice_number: invoiceForm.invoice_number.trim(),
        currency: invoiceForm.currency.toUpperCase(),
        status: invoiceForm.status,
        issued_at: invoiceForm.issued_at || null,
      });

      setInvoices((prev) => [created, ...prev]);
      setSelectedInvoiceId(created.id);
      closeCreateModal();
    } catch (error: any) {
      alert(error.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!selectedTrip) return;
    if (!confirm('Delete this invoice?')) return;
    try {
      await invoiceService.deleteInvoice(selectedTrip, invoiceId);
      const next = invoices.filter((invoice) => invoice.id !== invoiceId);
      setInvoices(next);
      setSelectedInvoiceId(next.length > 0 ? next[0].id : null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete invoice');
    }
  };

  const handleMarkPaid = async () => {
    if (!selectedTrip || !selectedInvoice) return;
    try {
      const updated = await invoiceService.updateInvoice(selectedTrip, selectedInvoice.id, {
        status: 'paid',
        paid_at: new Date().toISOString().slice(0, 10),
      });
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === updated.id ? { ...invoice, ...updated } : invoice
        )
      );
    } catch (error: any) {
      alert(error.message || 'Failed to mark invoice as paid');
    }
  };

  const handleAddItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTrip || !selectedInvoice || !itemForm.description.trim()) return;

    const amount = Number(itemForm.amount);
    const unitCost = Number(itemForm.unit_cost || 0);
    if (!Number.isFinite(amount) || amount < 0) return;

    setSubmitting(true);
    try {
      const encodedDescription = encodeItemDescription({
        category: itemForm.category.trim() || 'General',
        description: itemForm.description.trim(),
        qtyDetails: itemForm.qty_details.trim() || '1',
        unitCost: Number.isFinite(unitCost) ? unitCost : 0,
      });

      await invoiceService.addInvoiceItem(selectedInvoice.id, {
        description: encodedDescription,
        amount,
      });
      await loadInvoices(selectedTrip, selectedInvoice.id);
      closeItemModal();
    } catch (error: any) {
      alert(error.message || 'Failed to add invoice item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!selectedTrip || !selectedInvoice) return;
    if (!confirm('Remove this invoice item?')) return;
    try {
      await invoiceService.removeInvoiceItem(selectedInvoice.id, itemId);
      await loadInvoices(selectedTrip, selectedInvoice.id);
    } catch (error: any) {
      alert(error.message || 'Failed to remove invoice item');
    }
  };

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = () => {
    if (!selectedInvoice) return;
    const lines = [
      `Invoice: ${selectedInvoice.invoice_number}`,
      `Status: ${selectedInvoice.status}`,
      `Currency: ${selectedInvoice.currency}`,
      `Issued: ${selectedInvoice.issued_at || 'N/A'}`,
      '',
      'Items:',
      ...selectedDisplayItems.map(
        (item, index) =>
          `${index + 1}. [${item.category}] ${item.description} | Qty: ${item.qtyDetails} | Unit: ${selectedInvoice.currency} ${item.unitCost.toFixed(2)} | Amount: ${selectedInvoice.currency} ${item.amount.toFixed(2)}`
      ),
      '',
      `Subtotal: ${selectedInvoice.currency} ${subtotal.toFixed(2)}`,
      `Tax (5%): ${selectedInvoice.currency} ${tax.toFixed(2)}`,
      `Grand Total: ${selectedInvoice.currency} ${grandTotal.toFixed(2)}`,
    ];
    downloadTextFile(`${selectedInvoice.invoice_number}.txt`, lines.join('\n'));
  };

  const handleExportAsPdf = () => {
    if (!selectedInvoice) return;

    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) {
      alert('Unable to open print preview. Please allow popups.');
      return;
    }

    const rows = selectedDisplayItems
      .map(
        (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.category}</td>
          <td>${item.description}</td>
          <td>${item.qtyDetails}</td>
          <td style="text-align:right">${item.unitCost.toFixed(2)}</td>
          <td style="text-align:right">${item.amount.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedInvoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; }
            h1 { margin: 0 0 8px 0; }
            .muted { color: #6b7280; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; text-align: left; }
            .totals { margin-top: 16px; width: 320px; margin-left: auto; font-size: 13px; }
            .totals div { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .grand { font-weight: bold; border-top: 1px solid #d1d5db; padding-top: 8px; margin-top: 8px; }
          </style>
        </head>
        <body>
          <h1>Expense Invoice / Billing</h1>
          <div class="muted">
            Invoice ${selectedInvoice.invoice_number} · Status: ${statusLabelMap[selectedInvoice.status]} · Issued: ${selectedInvoice.issued_at ? dateUtils.formatDate(selectedInvoice.issued_at) : 'N/A'}
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Description</th>
                <th>Qty/details</th>
                <th style="text-align:right">Unit Cost</th>
                <th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="totals">
            <div><span>Subtotal</span><span>${formatMoney(subtotal, selectedInvoice.currency)}</span></div>
            <div><span>Tax (5%)</span><span>${formatMoney(tax, selectedInvoice.currency)}</span></div>
            <div><span>Discount</span><span>${formatMoney(discount, selectedInvoice.currency)}</span></div>
            <div class="grand"><span>Grand Total</span><span>${formatMoney(grandTotal, selectedInvoice.currency)}</span></div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleExportCsv = () => {
    const header = 'Invoice Number,Status,Currency,Total,Issued At,Paid At';
    const rows = invoices.map((invoice) =>
      [
        invoice.invoice_number,
        invoice.status,
        invoice.currency,
        Number(invoice.total).toFixed(2),
        invoice.issued_at || '',
        invoice.paid_at || '',
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    );
    downloadTextFile('invoices.csv', [header, ...rows].join('\n'));
  };

  const invoiceOptions = filteredInvoices.length > 0 ? filteredInvoices : invoices;

  return (
    <div className="container mx-auto px-4 py-2 max-w-none">
      <div className="mb-1">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
        >
          <ArrowLeft size={13} />
          back to my trips
        </Link>
      </div>

      <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-sora text-xl font-bold text-stone-900 dark:text-stone-100">
            Expense Invoice / Billing
          </h1>
          <p className="text-stone-500 text-xs mt-0.5">
            Minimal invoice view with line items and payment actions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="traveloop-input min-w-52"
            value={selectedTrip || ''}
            onChange={(event) => setSelectedTrip(event.target.value)}
          >
            <option value="" disabled>
              Select a trip...
            </option>
            {trips.map((tripItem) => (
              <option key={tripItem.id} value={tripItem.id}>
                {tripItem.name}
              </option>
            ))}
          </select>
          <button className="traveloop-button-secondary !px-4" onClick={handleExportCsv} disabled={invoices.length === 0}>
            <Download size={16} />
            Export CSV
          </button>
          <button
            className="traveloop-button-primary"
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedTrip}
          >
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            className="traveloop-input w-full pl-10"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 md:col-span-3">
          <Filter size={16} className="text-stone-500" />
          <select
            className="traveloop-input w-full"
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value as 'all' | InvoiceStatus)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="paid">Paid</option>
            <option value="void">Void</option>
          </select>
        </label>
        <select
          className="traveloop-input md:col-span-3"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as 'newest' | 'oldest' | 'highest' | 'lowest')}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="highest">Sort: Highest Amount</option>
          <option value="lowest">Sort: Lowest Amount</option>
        </select>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-md max-w-xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sora text-xl font-bold">Create Invoice</h2>
              <button onClick={closeCreateModal} className="text-stone-400 hover:text-stone-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="traveloop-label">Invoice Number *</label>
                <input
                  className="traveloop-input w-full"
                  value={invoiceForm.invoice_number}
                  onChange={(event) =>
                    setInvoiceForm((prev) => ({ ...prev, invoice_number: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="traveloop-label">Currency</label>
                  <input
                    className="traveloop-input w-full uppercase"
                    maxLength={3}
                    value={invoiceForm.currency}
                    onChange={(event) =>
                      setInvoiceForm((prev) => ({
                        ...prev,
                        currency: event.target.value.toUpperCase(),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="traveloop-label">Status</label>
                  <select
                    className="traveloop-input w-full"
                    value={invoiceForm.status}
                    onChange={(event) =>
                      setInvoiceForm((prev) => ({
                        ...prev,
                        status: event.target.value as InvoiceStatus,
                      }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="issued">Issued</option>
                    <option value="paid">Paid</option>
                    <option value="void">Void</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="traveloop-label">Issued Date</label>
                <input
                  type="date"
                  className="traveloop-input w-full"
                  value={invoiceForm.issued_at}
                  onChange={(event) =>
                    setInvoiceForm((prev) => ({ ...prev, issued_at: event.target.value }))
                  }
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="traveloop-button-secondary flex-1"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="traveloop-button-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddItemModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-md max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sora text-xl font-bold">Add Invoice Item</h2>
              <button onClick={closeItemModal} className="text-stone-400 hover:text-stone-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="traveloop-label">Category</label>
                  <input
                    className="traveloop-input w-full"
                    value={itemForm.category}
                    onChange={(event) =>
                      setItemForm((prev) => ({ ...prev, category: event.target.value }))
                    }
                    placeholder="hotel, travel, food..."
                  />
                </div>
                <div>
                  <label className="traveloop-label">Qty / Details</label>
                  <input
                    className="traveloop-input w-full"
                    value={itemForm.qty_details}
                    onChange={(event) =>
                      setItemForm((prev) => ({ ...prev, qty_details: event.target.value }))
                    }
                    placeholder="3 nights"
                  />
                </div>
              </div>
              <div>
                <label className="traveloop-label">Description *</label>
                <input
                  className="traveloop-input w-full"
                  value={itemForm.description}
                  onChange={(event) =>
                    setItemForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="traveloop-label">Unit Cost</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="traveloop-input w-full"
                    value={itemForm.unit_cost}
                    onChange={(event) =>
                      setItemForm((prev) => ({ ...prev, unit_cost: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="traveloop-label">Amount *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="traveloop-input w-full"
                    value={itemForm.amount}
                    onChange={(event) =>
                      setItemForm((prev) => ({ ...prev, amount: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="traveloop-button-secondary flex-1"
                  onClick={closeItemModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="traveloop-button-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]" />
        </div>
      ) : selectedTrip && invoices.length > 0 ? (
        <div className="space-y-3 pb-3">
          <div className="rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-2">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-stone-500">Total Invoices</p>
                <p className="font-sora text-lg font-bold text-stone-900 dark:text-stone-100">{invoices.length}</p>
              </div>
              <div>
                <p className="text-stone-500">Total Invoice Amount</p>
                <p className="font-sora text-lg font-bold text-stone-900 dark:text-stone-100">{formatMoney(totalInvoicesAmount, currency)}</p>
              </div>
              <div>
                <p className="text-stone-500">Pending Amount</p>
                <p className="font-sora text-lg font-bold text-red-500">{formatMoney(pendingAmount, currency)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-stone-500">Invoice</label>
                <select
                  className="traveloop-input w-full"
                  value={selectedInvoiceId || ''}
                  onChange={(event) => setSelectedInvoiceId(event.target.value)}
                >
                  {invoiceOptions.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number}
                    </option>
                  ))}
                </select>
                {selectedInvoice && (
                  <button
                    type="button"
                    onClick={() => handleDeleteInvoice(selectedInvoice.id)}
                    className="traveloop-button-secondary !px-2.5 !py-2"
                    title="Delete selected invoice"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="mt-1 grid grid-cols-2 md:grid-cols-5 gap-1.5 text-xs">
                <div>
                  <p className="text-stone-500">Trip</p>
                  <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">{trip?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-stone-500">Destination</p>
                  <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">{trip?.destination || '-'}</p>
                </div>
                <div>
                  <p className="text-stone-500">Invoice Id</p>
                  <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">{selectedInvoice?.invoice_number || '-'}</p>
                </div>
                <div>
                  <p className="text-stone-500">Generated</p>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    {selectedInvoice?.issued_at ? dateUtils.formatDate(selectedInvoice.issued_at) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Status</p>
                  {selectedInvoice && (
                    <span className={`odoo-badge ${statusClassMap[selectedInvoice.status]}`}>
                      {statusLabelMap[selectedInvoice.status]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-2">
              <h3 className="font-sora text-xs font-semibold mb-1">Budget Insights</h3>
              <div className="space-y-1 text-xs">
                <p className="flex justify-between"><span className="text-stone-500">Total Budget</span><span>{totalBudget.toFixed(2)}</span></p>
                <p className="flex justify-between"><span className="text-stone-500">Total Spent</span><span>{spentBudget.toFixed(2)}</span></p>
                <p className="flex justify-between"><span className="text-stone-500">Remaining</span><span className={remainingBudget < 0 ? 'text-red-500' : 'text-emerald-600'}>{remainingBudget.toFixed(2)}</span></p>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div className="h-full bg-[#714B67]" style={{ width: `${spentRatio}%` }} />
              </div>
            </div>
          </div>

          {selectedInvoice && (
            <>

              <div className="rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-stone-50 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-700">
                      <tr>
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Category</th>
                        <th className="px-3 py-2 text-left">Description</th>
                        <th className="px-3 py-2 text-left">Qty/details</th>
                        <th className="px-3 py-2 text-right">Unit Cost</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                        <th className="px-3 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDisplayItems.map((item, index) => (
                        <tr key={item.id} className="border-b border-stone-200 dark:border-stone-800">
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2 capitalize">{item.category}</td>
                          <td className="px-3 py-2">{item.description}</td>
                          <td className="px-3 py-2">{item.qtyDetails}</td>
                          <td className="px-3 py-2 text-right">{item.unitCost.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">{item.amount.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="traveloop-button-secondary !px-2 !py-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {selectedDisplayItems.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-4 text-center text-stone-500">
                            No line items yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-2 border-t border-stone-200 dark:border-stone-800 flex justify-end">
                  <div className="w-full max-w-sm space-y-1 text-xs">
                    <p className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatMoney(subtotal, currency)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span>{formatMoney(tax, currency)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Discount</span>
                      <span>{formatMoney(discount, currency)}</span>
                    </p>
                    <p className="flex justify-between font-sora text-xs font-semibold border-t border-stone-200 dark:border-stone-700 pt-2 mt-2">
                      <span>Grand Total</span>
                      <span>{formatMoney(grandTotal, currency)}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button className="traveloop-button-secondary !px-3 !py-2" onClick={handleDownloadInvoice}>
                    <Download size={16} />
                    Download Invoice
                  </button>
                  <button className="traveloop-button-secondary !px-3 !py-2" onClick={handleExportAsPdf}>
                    <FileText size={16} />
                    Export as PDF
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="traveloop-button-secondary !px-3 !py-2" onClick={() => setShowAddItemModal(true)}>
                    <Plus size={16} />
                    Add Item
                  </button>
                  <button
                    className="traveloop-button-primary !px-3 !py-2"
                    onClick={handleMarkPaid}
                    disabled={selectedInvoice.status === 'paid'}
                  >
                    <CheckCircle2 size={16} />
                    Mark as Paid
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md">
          <Receipt size={48} className="mx-auto text-stone-300 mb-4" />
          <h3 className="font-sora font-semibold text-stone-700 dark:text-stone-200 mb-1">No invoices found</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            {selectedTrip
              ? 'Create an invoice to start tracking expenses.'
              : 'Select a trip to manage invoices.'}
          </p>
        </div>
      )}
    </div>
  );
}
