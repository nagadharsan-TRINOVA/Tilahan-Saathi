import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Order } from '../../types';
import { supabaseOrderService } from '../../services/supabaseOrderService';
import { SUPABASE_PROJECT_ID, SUPABASE_REST_URL } from '../../lib/supabase';
import {
  Database,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  CreditCard,
  Code,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewCheckout?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onOpenNewCheckout,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const data = await supabaseOrderService.getOrders();
      setOrders(data);
    } catch (e) {
      console.error('Error loading order history from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrderHistory();
    }
  }, [isOpen]);

  const getStatusBadgeVariant = (status: Order['order_status']) => {
    switch (status) {
      case 'Delivered':
        return 'emerald';
      case 'Dispatched':
        return 'amber';
      case 'Confirmed':
        return 'blue';
      case 'Placed':
        return 'purple';
      case 'Cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Order Database - Farmer Orders History"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-300 block">
                Supabase PostgreSQL Table: `orders`
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Project ID: {SUPABASE_PROJECT_ID} • {orders.length} Records Connected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchOrderHistory}
              disabled={loading}
              className="border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Refresh DB
            </Button>
            {onOpenNewCheckout && (
              <Button
                variant="primary"
                size="sm"
                icon={ShoppingBag}
                onClick={() => {
                  onClose();
                  onOpenNewCheckout();
                }}
              >
                New Order
              </Button>
            )}
          </div>
        </div>

        {/* Order Items List */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-600 font-medium">Fetching orders from Supabase...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm font-serif">No Orders Found in Supabase</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Place a seed mini-kit order using the checkout form to register real order data in Supabase.
            </p>
            {onOpenNewCheckout && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenNewCheckout();
                }}
              >
                Place First Order
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              return (
                <Card
                  key={order.id}
                  className="p-4 space-y-3 hover:border-emerald-300 transition-all border border-slate-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-xs text-slate-900">
                        {order.order_number || order.id}
                      </span>
                      <Badge variant={getStatusBadgeVariant(order.order_status)}>
                        {order.order_status}
                      </Badge>
                      <Badge variant="emerald" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                        Supabase Synced
                      </Badge>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : 'Recent'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">
                        Farmer Credentials
                      </span>
                      <p className="font-bold text-slate-800">{order.farmer_name}</p>
                      <p className="text-slate-500 text-[11px]">{order.farmer_phone}</p>
                      <p className="text-slate-500 text-[11px]">Kisan ID: {order.kisan_id}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">
                        Ordered Input
                      </span>
                      <p className="font-semibold text-slate-900">
                        {order.items[0]?.name || 'Certified Seed Mini-Kit'}
                      </p>
                      <p className="text-slate-500 text-[11px]">Qty: {order.items[0]?.quantity || 1} Bags</p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">
                        Pricing & Payment
                      </span>
                      <p className="text-sm font-extrabold text-[#2E7D32]">
                        ₹{order.net_payable_rupees?.toLocaleString('en-IN') || 0}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        Subsidy: -₹{order.subsidy_applied_rupees?.toLocaleString('en-IN') || 0}
                      </p>
                      <p className="text-[11px] text-slate-500">{order.payment_method}</p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="p-2.5 rounded-xl bg-slate-50 text-xs flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">
                        {order.delivery_address?.village}, {order.delivery_address?.district},{' '}
                        {order.delivery_address?.state} {order.delivery_address?.pincode}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id || null)}
                      className="text-emerald-700 font-bold text-[11px] hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      <Code className="w-3 h-3" />
                      {isExpanded ? 'Hide Raw JSON' : 'Inspect Database JSON'}
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Raw Supabase Row Inspector */}
                  {isExpanded && (
                    <div className="bg-slate-950 p-3 rounded-xl text-white font-mono text-[10px] space-y-1">
                      <div className="text-slate-400 flex justify-between">
                        <span>Supabase Record ID: {order.id}</span>
                        <span>Endpoint: {SUPABASE_REST_URL}orders</span>
                      </div>
                      <pre className="text-emerald-300 overflow-x-auto p-2 bg-slate-900 rounded-lg">
                        {JSON.stringify(order, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
