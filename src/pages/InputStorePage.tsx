import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CheckoutModal } from '../components/orders/CheckoutModal';
import { OrderHistoryModal } from '../components/orders/OrderHistoryModal';
import { AgriInputProduct, Order } from '../types';
import { SUPABASE_PROJECT_ID, SUPABASE_PROJECT_NAME } from '../lib/supabase';
import {
  ShoppingBag,
  Database,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Droplets,
  Award,
  Layers,
  ArrowRight,
  Search,
  Filter,
} from 'lucide-react';

const FEATURED_PRODUCTS: AgriInputProduct[] = [
  {
    id: 'prod-1',
    name: 'Yellow Mustard (Pusa Bold) High-Yield Certified Seeds',
    hindiName: 'पीली सरसों (पुसा बोल्ड) प्रमाणित बीज',
    category: 'Certified Seeds',
    cropTarget: 'Mustard / Rapeseed',
    unitPriceRupees: 900,
    subsidyPercent: 50,
    unitSize: '5 kg Bag (For 1.25 Acres)',
    description: 'High oil content (42%), drought tolerant, certified seed mini-kit subsidized under National Mission on Edible Oils.',
    inStock: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-2',
    name: 'Groundnut G-2 High-Density Seed Pods',
    hindiName: 'मूंगफली जी-2 उच्च पैदावार बीज',
    category: 'Certified Seeds',
    cropTarget: 'Groundnut',
    unitPriceRupees: 1800,
    subsidyPercent: 40,
    unitSize: '20 kg Bag (For 1 Acre)',
    description: 'Early maturing Kharif/Rabi variety with excellent pod filling and aflatoxin resistance.',
    inStock: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-3',
    name: 'Soybean JS 335 Certified Oilseed Variety',
    hindiName: 'सोयाबीन जेएस ३३५ प्रमाणित बीज',
    category: 'Certified Seeds',
    cropTarget: 'Soybean',
    unitPriceRupees: 1500,
    subsidyPercent: 45,
    unitSize: '15 kg Bag (For 0.75 Acre)',
    description: 'Popular high protein & oil cultivar, shattering resistant and highly pest tolerant.',
    inStock: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-4',
    name: 'Rhizobium + PSB Bio-Fertilizer Dual Pack',
    hindiName: 'राइजोबियम + पीएसबी जैव उर्वरक',
    category: 'Bio-Fertilizer',
    cropTarget: 'All Oilseeds',
    unitPriceRupees: 400,
    subsidyPercent: 30,
    unitSize: '1 Ltr Liquid Bottle',
    description: 'Enhances nitrogen fixation and phosphate solubilization in roots, cutting chemical fertilizer costs by 25%.',
    inStock: true,
    rating: 4.9,
  },
  {
    id: 'prod-5',
    name: 'Zinc Sulphate Monohydrate 33% Micronutrient',
    hindiName: 'जिंक सल्फेट ३३% सूक्ष्म पोषक तत्व',
    category: 'Soil Conditioner',
    cropTarget: 'Mustard & Groundnut',
    unitPriceRupees: 650,
    subsidyPercent: 25,
    unitSize: '10 kg Pack',
    description: 'Prevents white bud leaf chlorosis and enhances oil synthesis in oilseed pods.',
    inStock: true,
    rating: 4.6,
  },
  {
    id: 'prod-6',
    name: 'NMEO Oilseeds Comprehensive Care Protection Kit',
    hindiName: 'तेलहन फसल सुरक्षा संपूर्ण किट',
    category: 'Pesticide',
    cropTarget: 'All Oilseeds',
    unitPriceRupees: 1200,
    subsidyPercent: 50,
    unitSize: '1 Complete Field Kit',
    description: 'Includes neem-based bio-pesticide, yellow sticky traps, and bio-fungicide for aphid and blight control.',
    inStock: true,
    rating: 4.8,
  },
];

export const InputStorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<AgriInputProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersHistoryOpen, setIsOrdersHistoryOpen] = useState(false);

  const categories = ['All', 'Certified Seeds', 'Bio-Fertilizer', 'Soil Conditioner', 'Pesticide'];

  const filteredProducts = FEATURED_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.cropTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.hindiName && prod.hindiName.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleOpenCheckout = (product: AgriInputProduct) => {
    setSelectedProductForCheckout(product);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB300]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Badge variant="amber" className="bg-[#FFB300] text-amber-950 font-bold border-none">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            National Mission on Edible Oils (NMEO-OP)
          </Badge>

          {/* Database Connected Badge & Action */}
          <button
            onClick={() => setIsOrdersHistoryOpen(true)}
            className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all"
          >
            <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Supabase DB: Connected ({SUPABASE_PROJECT_ID})</span>
          </button>
        </div>

        <div className="space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
            Subsidized Agri-Inputs & Certified Seed Mini-Kits
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
            Order official Govt-certified oilseed varieties (Mustard, Groundnut, Soybean) with up to 50% NMEO subsidy.
            All checkout orders automatically send full order field data to Supabase.
          </p>
        </div>

        <div className="pt-6 flex flex-wrap items-center gap-3 border-t border-emerald-800/80 mt-6">
          <Button
            variant="secondary"
            size="sm"
            icon={ShoppingBag}
            onClick={() => handleOpenCheckout(FEATURED_PRODUCTS[0])}
          >
            Quick Order Seed Kit
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Database}
            onClick={() => setIsOrdersHistoryOpen(true)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            View Order Database
          </Button>
        </div>
      </Card>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seed, variety, or crop..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#2E7D32] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => {
          const discountedPrice = prod.unitPriceRupees - Math.round((prod.unitPriceRupees * prod.subsidyPercent) / 100);
          return (
            <Card
              key={prod.id}
              hoverEffect
              className="flex flex-col justify-between p-5 space-y-4 border border-slate-200"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="amber" size="sm">
                    {prod.category}
                  </Badge>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {prod.subsidyPercent}% Subsidy
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base font-serif leading-snug">
                    {prod.name}
                  </h3>
                  {prod.hindiName && (
                    <p className="text-xs text-slate-500 font-serif mt-0.5">{prod.hindiName}</p>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {prod.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>Crop: {prod.cropTarget}</span>
                  <span className="text-slate-300">•</span>
                  <span>{prod.unitSize}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-[#2E7D32] font-serif">
                      ₹{discountedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{prod.unitPriceRupees.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block">
                    Govt Subsidized Rate
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  icon={ShoppingBag}
                  onClick={() => handleOpenCheckout(prod)}
                >
                  Order to Supabase
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Components */}
      {selectedProductForCheckout && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          initialItem={{
            name: selectedProductForCheckout.name,
            category: selectedProductForCheckout.category,
            unitPriceRupees: selectedProductForCheckout.unitPriceRupees,
            subsidyPercent: selectedProductForCheckout.subsidyPercent,
            quantity: 2,
          }}
          onOrderSuccess={(order) => {
            console.log('Order successfully sent to Supabase:', order);
          }}
        />
      )}

      <OrderHistoryModal
        isOpen={isOrdersHistoryOpen}
        onClose={() => setIsOrdersHistoryOpen(false)}
        onOpenNewCheckout={() => {
          setSelectedProductForCheckout(FEATURED_PRODUCTS[0]);
          setIsCheckoutOpen(true);
        }}
      />
    </div>
  );
};
