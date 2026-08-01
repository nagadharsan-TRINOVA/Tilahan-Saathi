import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { useApp } from '../../contexts/AppContext';
import { Order, OrderItem, OrderDeliveryAddress } from '../../types';
import { supabaseOrderService, SupabaseResponse } from '../../services/supabaseOrderService';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_PROJECT_NAME,
  SUPABASE_REST_URL,
} from '../../lib/supabase';
import {
  ShoppingBag,
  Database,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: {
    name: string;
    category: OrderItem['category'];
    unitPriceRupees: number;
    subsidyPercent: number;
    quantity?: number;
    unitSize?: string;
  };
  cropRecommendationId?: string;
  onOrderSuccess?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  initialItem,
  cropRecommendationId,
  onOrderSuccess,
}) => {
  const { profile, addToast } = useApp();

  // Form State
  const [farmerName, setFarmerName] = useState(profile?.name || 'Ramesh Patel');
  const [farmerPhone, setFarmerPhone] = useState(profile?.phone || '+91 98765 43210');
  const [kisanId, setKisanId] = useState(profile?.kisanId || 'KCC-RJ-883921');
  
  // Delivery address fields
  const [village, setVillage] = useState(profile?.village || 'Sanganer');
  const [district, setDistrict] = useState(profile?.district || 'Jaipur');
  const [state, setState] = useState(profile?.state || 'Rajasthan');
  const [pincode, setPincode] = useState('302029');
  const [landmark, setLandmark] = useState('Near Gram Panchayat Bhavan');

  // Order Details
  const [quantity, setQuantity] = useState(initialItem?.quantity || 2);
  const [selectedProduct, setSelectedProduct] = useState(
    initialItem?.name || 'Certified Yellow Mustard (Pusa Bold) - High Oil Seeds'
  );
  const [category, setCategory] = useState<OrderItem['category']>(
    initialItem?.category || 'Certified Seeds'
  );
  const [unitPrice, setUnitPrice] = useState(initialItem?.unitPriceRupees || 850);
  const [subsidyPercent, setSubsidyPercent] = useState(initialItem?.subsidyPercent || 50);
  const [landArea, setLandArea] = useState<number>(profile?.totalLandArea || 3.5);
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<Order['payment_method']>('Direct Subsidy Transfer');
  const [notes, setNotes] = useState('NMEO-OP Subsidized Certified Seed Mini-Kit Order');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<SupabaseResponse | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  // Synchronize initial item if changed
  useEffect(() => {
    if (initialItem) {
      setSelectedProduct(initialItem.name);
      setCategory(initialItem.category);
      setUnitPrice(initialItem.unitPriceRupees);
      setSubsidyPercent(initialItem.subsidyPercent);
      if (initialItem.quantity) setQuantity(initialItem.quantity);
    }
  }, [initialItem]);

  // Calculated Pricing
  const totalBaseAmount = quantity * unitPrice;
  const subsidyApplied = Math.round((totalBaseAmount * subsidyPercent) / 100);
  const netPayable = totalBaseAmount - subsidyApplied;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerName.trim() || !farmerPhone.trim() || !village.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please fill in farmer name, phone number, and delivery village.',
      });
      return;
    }

    setIsSubmitting(true);

    const items: OrderItem[] = [
      {
        id: `item-${Date.now()}`,
        name: selectedProduct,
        category,
        quantity,
        unitPriceRupees: unitPrice,
        subsidyPercent,
        totalPriceRupees: totalBaseAmount,
      },
    ];

    const orderPayload: Partial<Order> = {
      farmer_id: profile?.id || 'farm-001',
      farmer_name: farmerName,
      farmer_phone: farmerPhone,
      kisan_id: kisanId,
      delivery_address: {
        village,
        district,
        state,
        pincode,
        landmark,
      },
      items,
      total_amount_rupees: totalBaseAmount,
      subsidy_applied_rupees: subsidyApplied,
      net_payable_rupees: netPayable,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'Direct Subsidy Transfer' ? 'Completed' : 'Pending',
      order_status: 'Placed',
      crop_recommendation_id: cropRecommendationId,
      land_area_acres: landArea,
      notes,
    };

    try {
      const response = await supabaseOrderService.sendOrderToSupabase(orderPayload);
      setOrderResult(response);

      const savedOrder: Order = {
        id: response.orderId,
        order_number: response.orderNumber,
        farmer_id: orderPayload.farmer_id!,
        farmer_name: orderPayload.farmer_name!,
        farmer_phone: orderPayload.farmer_phone!,
        kisan_id: orderPayload.kisan_id!,
        delivery_address: orderPayload.delivery_address!,
        items: orderPayload.items!,
        total_amount_rupees: orderPayload.total_amount_rupees!,
        subsidy_applied_rupees: orderPayload.subsidy_applied_rupees!,
        net_payable_rupees: orderPayload.net_payable_rupees!,
        payment_method: orderPayload.payment_method!,
        payment_status: orderPayload.payment_status!,
        order_status: orderPayload.order_status!,
        notes: orderPayload.notes,
        created_at: response.timestamp,
        supabase_synced: true,
      };

      setCompletedOrder(savedOrder);
      addToast({
        type: 'success',
        title: 'Order Sent to Supabase Database!',
        message: `Order #${response.orderNumber} successfully registered in Supabase (${SUPABASE_PROJECT_ID}).`,
      });

      if (onOrderSuccess) {
        onOrderSuccess(savedOrder);
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: err.message || 'Failed to transmit order to Supabase.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetModal = () => {
    setOrderResult(null);
    setCompletedOrder(null);
    onClose();
  };

  const handleCopyJson = () => {
    if (orderResult?.data) {
      navigator.clipboard.writeText(JSON.stringify(orderResult.data, null, 2));
      addToast({
        type: 'info',
        title: 'Copied to Clipboard',
        message: 'Supabase JSON Order Payload copied.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={orderResult ? handleResetModal : onClose}
      title={orderResult ? 'Supabase Order Confirmation' : 'Subsidized Seed & Input Checkout'}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Supabase Connection Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Database className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-emerald-200 block">
                Database Target: Supabase REST API
              </span>
              <span className="text-[10px] text-slate-300 font-mono">
                Project: {SUPABASE_PROJECT_NAME} ({SUPABASE_PROJECT_ID})
              </span>
            </div>
          </div>

          <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
            Live Connected
          </Badge>
        </div>

        {/* Order Confirmation Screen */}
        {orderResult && completedOrder ? (
          <div className="space-y-5 py-2">
            <div className="text-center space-y-2 bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-xl font-extrabold font-serif text-emerald-950">
                Order Sent to Supabase Database!
              </h2>

              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                All order fields have been processed and transmitted to Supabase REST API at{' '}
                <span className="font-mono font-semibold">{SUPABASE_REST_URL}orders</span>.
              </p>

              <div className="inline-flex items-center gap-2 bg-emerald-900 text-emerald-100 px-4 py-1.5 rounded-full text-xs font-mono font-bold mt-2">
                Order #: {completedOrder.order_number}
              </div>
            </div>

            {/* Transmitted Order Summary Card */}
            <Card className="p-4 bg-slate-50 space-y-3 text-xs border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800">Supabase Record ID</span>
                <span className="font-mono text-emerald-700 font-bold">{completedOrder.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Farmer Name</span>
                  <span className="font-semibold text-slate-900">{completedOrder.farmer_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="font-semibold text-slate-900">{completedOrder.farmer_phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Kisan Card / ID</span>
                  <span className="font-semibold text-slate-900">{completedOrder.kisan_id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Delivery Location</span>
                  <span className="font-semibold text-slate-900">
                    {completedOrder.delivery_address.village}, {completedOrder.delivery_address.district},{' '}
                    {completedOrder.delivery_address.state}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Ordered Input:</span>
                  <span className="font-bold text-slate-900">
                    {completedOrder.items[0]?.name} (x{completedOrder.items[0]?.quantity})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Base Price Total:</span>
                  <span>₹{completedOrder.total_amount_rupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Govt Subsidy (NMEO-OP):</span>
                  <span>- ₹{completedOrder.subsidy_applied_rupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                  <span>Net Payable Amount:</span>
                  <span className="text-[#2E7D32]">₹{completedOrder.net_payable_rupees.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Card>

            {/* Toggle Raw JSON Inspector */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 text-white">
              <button
                type="button"
                onClick={() => setShowJsonPayload(!showJsonPayload)}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-mono">
                  <Code className="w-4 h-4" />
                  View Transmitted Supabase JSON Payload
                </div>
                {showJsonPayload ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showJsonPayload && (
                <div className="p-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Database URL: {SUPABASE_REST_URL}orders</span>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 text-emerald-400 hover:underline"
                    >
                      <Copy className="w-3 h-3" /> Copy JSON
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-60">
                    {JSON.stringify(orderResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="primary" onClick={handleResetModal}>
                Done & Return to App
              </Button>
            </div>
          </div>
        ) : (
          /* Checkout Input Form */
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            {/* Selected Product Card */}
            <Card className="bg-emerald-50/70 border border-emerald-200/80 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Badge variant="amber" size="sm" className="mb-1">
                    {category} • NMEO Subsidized
                  </Badge>
                  <h3 className="font-bold text-slate-900 text-sm font-serif">
                    {selectedProduct}
                  </h3>
                  <p className="text-xs text-slate-600">
                    High-yielding oilseed seed mini-kit certified by National Seeds Corporation
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-500 line-through block">
                    ₹{(quantity * unitPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg font-extrabold text-[#2E7D32]">
                    ₹{netPayable.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-700 block font-bold">
                    {subsidyPercent}% Subsidy Applied
                  </span>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 pt-2 border-t border-emerald-200/60 text-xs">
                <label className="font-bold text-slate-700">Quantity (Bags/Kits):</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="font-bold text-slate-900 px-2">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-slate-500 ml-auto">
                  ₹{unitPrice}/bag (Subsidy ₹{Math.round((unitPrice * subsidyPercent) / 100)})
                </span>
              </div>
            </Card>

            {/* Farmer Profile Information */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                1. Farmer Identification & Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Farmer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kisan Credit Card / Aadhaar ID
                  </label>
                  <input
                    type="text"
                    value={kisanId}
                    onChange={(e) => setKisanId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none"
                    placeholder="KCC-RJ-883921"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                2. Village & Delivery Address
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Village *</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Landmark / Farm Gate Details
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                  placeholder="Near Primary Health Centre or Khasra No."
                />
              </div>
            </div>

            {/* Payment Method & Land Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] bg-white outline-none"
                >
                  <option value="Direct Subsidy Transfer">Direct Subsidy Transfer (Kisan Portal)</option>
                  <option value="Cash on Delivery">Cash on Delivery (Village Hub)</option>
                  <option value="UPI / NetBanking">UPI / QR Code / NetBanking</option>
                  <option value="Kisan Credit Card (KCC)">Kisan Credit Card Loan Account</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Land Area to be Sown (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={landArea}
                  onChange={(e) => setLandArea(parseFloat(e.target.value) || 1)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Agronomic Delivery Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                placeholder="Mention seed treatment requirements or preferred delivery date..."
              />
            </div>

            {/* Cost Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-100 space-y-1.5 text-xs border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Total Item MRP:</span>
                <span>₹{totalBaseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>NMEO Govt Subsidy Discount ({subsidyPercent}%):</span>
                <span>- ₹{subsidyApplied.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-300">
                <span>Net Payable Amount:</span>
                <span className="text-[#2E7D32]">₹{netPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="min-w-[180px] shadow-md"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Supabase...</span>
                  </div>
                ) : (
                  <span>Submit Order to Supabase</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
