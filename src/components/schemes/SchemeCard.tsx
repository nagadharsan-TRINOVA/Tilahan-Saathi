import React, { useEffect, useState } from 'react';
import { GovernmentScheme } from '../../types';
import { schemeService } from '../../services/schemeService';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Search,
  Building2,
  Award,
  CheckCircle2,
  FileText,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { SchemeDetailModal } from './SchemeDetailModal';

export const SchemeCardList: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  useEffect(() => {
    schemeService.getSchemes().then(setSchemes);
  }, []);

  const categories = ['ALL', 'Subsidy', 'Insurance', 'Soil Health', 'Credit / Loan'];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.schemeName.toLowerCase().includes(search.toLowerCase()) ||
      s.benefits.toLowerCase().includes(search.toLowerCase()) ||
      (s.hindiName && s.hindiName.includes(search));

    const matchesCategory =
      categoryFilter === 'ALL' || s.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Chips Bar */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              National Oilseed Government Schemes & Grants
            </h2>
            <p className="text-xs text-slate-500">
              NMEO-Oilseeds, Soil Health Card, PM-KISAN, PMFBY & Farm Machinery Subsidies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by scheme name, subsidy, or document..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
            />
          </div>

          {/* Filter Chips */}
          <div className="lg:col-span-2 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            hoverEffect
            className="flex flex-col justify-between space-y-4 border border-emerald-900/10"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="purple" size="md">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  {scheme.category}
                </Badge>
                {scheme.applicationDeadline && (
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    Deadline: {scheme.applicationDeadline}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif leading-snug">
                  {scheme.schemeName}
                </h3>
                {scheme.hindiName && (
                  <p className="text-xs font-medium text-emerald-800 mt-0.5">
                    {scheme.hindiName}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-emerald-950 uppercase text-[10px] block">
                  Benefits & Subsidy:
                </span>
                <p className="leading-relaxed">{scheme.benefits}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 text-[10px] uppercase block">
                  Eligibility:
                </span>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {scheme.eligibility}
                </p>
              </div>

              {/* Documents */}
              <div className="space-y-1 pt-1">
                <span className="font-bold text-slate-700 text-[10px] uppercase block">
                  Required Documents:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.requiredDocuments.map((doc, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-slate-400 text-[10px] block">Max Assistance</span>
                <span className="font-extrabold text-[#2E7D32] font-serif text-sm">
                  {scheme.subsidyAmountMax}
                </span>
              </div>

              <Button
                variant="accent"
                size="md"
                onClick={() => setSelectedScheme(scheme)}
              >
                Apply Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Application Modal */}
      <SchemeDetailModal
        isOpen={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        scheme={selectedScheme}
      />
    </div>
  );
};
