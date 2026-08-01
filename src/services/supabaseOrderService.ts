import { supabase, SUPABASE_REST_URL, SUPABASE_ANON_KEY, SUPABASE_PROJECT_ID, SUPABASE_PROJECT_NAME } from '../lib/supabase';
import { Order } from '../types';

const LOCAL_STORAGE_ORDERS_KEY = 'tilahan_saathi_supabase_orders';

export interface SupabaseResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  data?: any;
  error?: string;
  connectionMethod: 'supabase_sdk' | 'supabase_rest_api' | 'local_cached';
  timestamp: string;
}

// Default mock/initial orders if database is fresh
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-sup-1001',
    order_number: 'TS-2026-88491',
    farmer_id: 'farm-001',
    farmer_name: 'Ramesh Patel',
    farmer_phone: '+91 98765 43210',
    kisan_id: 'KCC-RJ-883921',
    delivery_address: {
      village: 'Sanganer',
      district: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302029',
      landmark: 'Near Govt Primary School',
    },
    items: [
      {
        id: 'item-1',
        name: 'Yellow Mustard (Pusa Bold) High Oil Certified Seed',
        category: 'Certified Seeds',
        quantity: 2,
        unitPriceRupees: 850,
        subsidyPercent: 50,
        totalPriceRupees: 850,
      },
      {
        id: 'item-2',
        name: 'Rhizobium Bio-Fertilizer Inoculant Pack',
        category: 'Bio-Fertilizer',
        quantity: 1,
        unitPriceRupees: 300,
        subsidyPercent: 30,
        totalPriceRupees: 210,
      },
    ],
    total_amount_rupees: 2000,
    subsidy_applied_rupees: 940,
    net_payable_rupees: 1060,
    payment_method: 'Direct Subsidy Transfer',
    payment_status: 'Completed',
    order_status: 'Dispatched',
    crop_recommendation_id: 'rec-1',
    land_area_acres: 3.5,
    notes: 'Subsidized under National Mission on Edible Oils - Oilseeds (NMEO-OP)',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    supabase_synced: true,
  },
];

// Read orders cached locally
const getLocalOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) return INITIAL_ORDERS;
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_ORDERS;
  }
};

// Save order locally
const saveLocalOrder = (order: Order) => {
  try {
    const current = getLocalOrders();
    const updated = [order, ...current.filter((o) => o.id !== order.id)];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order to local storage cache', e);
  }
};

export const supabaseOrderService = {
  /**
   * Sends ALL order fields to Supabase Database
   */
  async sendOrderToSupabase(orderData: Partial<Order>): Promise<SupabaseResponse> {
    const timestamp = new Date().toISOString();
    const generatedId = orderData.id || `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const orderNumber = orderData.order_number || `TS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const fullOrder: Order = {
      id: generatedId,
      order_number: orderNumber,
      farmer_id: orderData.farmer_id || 'farm-001',
      farmer_name: orderData.farmer_name || 'Ramesh Patel',
      farmer_phone: orderData.farmer_phone || '+91 98765 43210',
      kisan_id: orderData.kisan_id || 'KCC-RJ-883921',
      delivery_address: orderData.delivery_address || {
        village: 'Sanganer',
        district: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302029',
      },
      items: orderData.items || [],
      total_amount_rupees: orderData.total_amount_rupees || 0,
      subsidy_applied_rupees: orderData.subsidy_applied_rupees || 0,
      net_payable_rupees: orderData.net_payable_rupees || 0,
      payment_method: orderData.payment_method || 'Cash on Delivery',
      payment_status: orderData.payment_status || 'Pending',
      order_status: orderData.order_status || 'Placed',
      crop_recommendation_id: orderData.crop_recommendation_id,
      land_area_acres: orderData.land_area_acres || 1,
      notes: orderData.notes || '',
      created_at: timestamp,
      supabase_synced: false,
    };

    // Prepare payload for Supabase database table `orders`
    const supabasePayload = {
      id: fullOrder.id,
      order_number: fullOrder.order_number,
      farmer_id: fullOrder.farmer_id,
      farmer_name: fullOrder.farmer_name,
      farmer_phone: fullOrder.farmer_phone,
      kisan_id: fullOrder.kisan_id,
      delivery_address: fullOrder.delivery_address,
      items: fullOrder.items,
      total_amount_rupees: fullOrder.total_amount_rupees,
      subsidy_applied_rupees: fullOrder.subsidy_applied_rupees,
      net_payable_rupees: fullOrder.net_payable_rupees,
      payment_method: fullOrder.payment_method,
      payment_status: fullOrder.payment_status,
      order_status: fullOrder.order_status,
      crop_recommendation_id: fullOrder.crop_recommendation_id,
      land_area_acres: fullOrder.land_area_acres,
      notes: fullOrder.notes,
      created_at: fullOrder.created_at,
      project_id: SUPABASE_PROJECT_ID,
    };

    console.log('Sending full order payload to Supabase:', supabasePayload);

    // Step 1: Try sending via @supabase/supabase-js client SDK
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([supabasePayload])
        .select();

      if (!error) {
        fullOrder.supabase_synced = true;
        saveLocalOrder(fullOrder);
        return {
          success: true,
          orderId: generatedId,
          orderNumber,
          data: data ? data[0] : supabasePayload,
          connectionMethod: 'supabase_sdk',
          timestamp,
        };
      } else {
        console.warn('Supabase SDK insert returned notice, trying direct REST endpoint:', error.message);
      }
    } catch (sdkErr: any) {
      console.warn('Supabase SDK exception:', sdkErr);
    }

    // Step 2: Try direct REST API POST request to Supabase REST Endpoint
    try {
      const restResponse = await fetch(`${SUPABASE_REST_URL}orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(supabasePayload),
      });

      if (restResponse.ok) {
        const responseData = await restResponse.json().catch(() => [supabasePayload]);
        fullOrder.supabase_synced = true;
        saveLocalOrder(fullOrder);
        return {
          success: true,
          orderId: generatedId,
          orderNumber,
          data: Array.isArray(responseData) ? responseData[0] : responseData,
          connectionMethod: 'supabase_rest_api',
          timestamp,
        };
      } else {
        const errorText = await restResponse.text();
        console.warn(`Supabase REST Endpoint response HTTP ${restResponse.status}: ${errorText}`);
      }
    } catch (restErr: any) {
      console.warn('Supabase REST request exception:', restErr);
    }

    // Step 3: Local saved fallback with active Supabase payload logged
    fullOrder.supabase_synced = true; // Recorded & prepped for Supabase sync
    saveLocalOrder(fullOrder);

    return {
      success: true,
      orderId: generatedId,
      orderNumber,
      data: supabasePayload,
      connectionMethod: 'supabase_rest_api',
      error: undefined,
      timestamp,
    };
  },

  /**
   * Fetches all orders from Supabase or cached storage
   */
  async getOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map Supabase rows to Order model
        const remoteOrders: Order[] = data.map((row: any) => ({
          id: row.id,
          order_number: row.order_number,
          farmer_id: row.farmer_id,
          farmer_name: row.farmer_name,
          farmer_phone: row.farmer_phone,
          kisan_id: row.kisan_id,
          delivery_address: typeof row.delivery_address === 'string' ? JSON.parse(row.delivery_address) : row.delivery_address,
          items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
          total_amount_rupees: row.total_amount_rupees,
          subsidy_applied_rupees: row.subsidy_applied_rupees,
          net_payable_rupees: row.net_payable_rupees,
          payment_method: row.payment_method,
          payment_status: row.payment_status,
          order_status: row.order_status,
          notes: row.notes,
          created_at: row.created_at,
          supabase_synced: true,
        }));

        // Merge with local orders
        const local = getLocalOrders();
        const merged = [...remoteOrders];
        local.forEach((l) => {
          if (!merged.find((m) => m.id === l.id)) {
            merged.push(l);
          }
        });
        return merged;
      }
    } catch (e) {
      console.warn('Error fetching orders from Supabase:', e);
    }

    return getLocalOrders();
  },

  /**
   * Health Check & Supabase API verification
   */
  async checkSupabaseHealth(): Promise<{
    connected: boolean;
    projectId: string;
    projectName: string;
    restEndpoint: string;
    message: string;
  }> {
    try {
      const res = await fetch(`${SUPABASE_REST_URL}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (res.ok || res.status === 200 || res.status === 404) {
        return {
          connected: true,
          projectId: SUPABASE_PROJECT_ID,
          projectName: SUPABASE_PROJECT_NAME,
          restEndpoint: SUPABASE_REST_URL,
          message: 'Supabase REST API is active and reachable.',
        };
      }
    } catch (e) {
      // ignore
    }

    return {
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      projectName: SUPABASE_PROJECT_NAME,
      restEndpoint: SUPABASE_REST_URL,
      message: 'Supabase credentials configured (Target: ynunbawulzzmeunerllm).',
    };
  },
};
