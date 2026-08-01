import React, { useState } from 'react';
import { LandRecord, SoilType, WaterSource } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  SlidersHorizontal,
  MapPin,
  Layers,
  Droplets,
} from 'lucide-react';

interface LandTableProps {
  lands: LandRecord[];
  onAdd: () => void;
  onView: (land: LandRecord) => void;
  onEdit: (land: LandRecord) => void;
  onDelete: (land: LandRecord) => void;
}

export const LandTable: React.FC<LandTableProps> = ({
  lands,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [soilFilter, setSoilFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'farmName' | 'areaAcres'>('farmName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter & Search
  const filteredLands = lands
    .filter((l) => {
      const matchesSearch =
        l.farmName.toLowerCase().includes(search.toLowerCase()) ||
        l.district.toLowerCase().includes(search.toLowerCase()) ||
        l.village.toLowerCase().includes(search.toLowerCase()) ||
        l.soilType.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || l.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSoil = soilFilter === 'ALL' || l.soilType === soilFilter;

      return matchesSearch && matchesStatus && matchesSoil;
    })
    .sort((a, b) => {
      if (sortField === 'areaAcres') {
        return sortOrder === 'asc'
          ? a.areaAcres - b.areaAcres
          : b.areaAcres - a.areaAcres;
      }
      return sortOrder === 'asc'
        ? a.farmName.localeCompare(b.farmName)
        : b.farmName.localeCompare(a.farmName);
    });

  return (
    <Card className="space-y-4 p-4 sm:p-6">
      {/* Table Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Registered Oilseed Farm Lands
          </h2>
          <p className="text-xs text-slate-500">
            Manage your land plots, soil profiles & water sources
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={onAdd}>
          Add Land Record
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farm name, village, district..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white text-slate-700"
          >
            <option value="ALL">All Land Statuses</option>
            <option value="Active">Active</option>
            <option value="Sown">Sown</option>
            <option value="Fallow">Fallow</option>
            <option value="Harvesting">Harvesting</option>
          </select>
        </div>

        {/* Soil Filter */}
        <div>
          <select
            value={soilFilter}
            onChange={(e) => setSoilFilter(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white text-slate-700"
          >
            <option value="ALL">All Soil Types</option>
            <option value="Sandy Loam">Sandy Loam</option>
            <option value="Black Soil (Regur)">Black Soil (Regur)</option>
            <option value="Loamy">Loamy</option>
            <option value="Red & Yellow">Red & Yellow</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (sortField === 'farmName') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('farmName');
                setSortOrder('asc');
              }
            }}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-slate-700"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sort: {sortField === 'farmName' ? 'Name' : 'Area'}</span>
            </span>
            <span className="font-bold uppercase text-[10px]">{sortOrder}</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-emerald-50/60 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3.5">Farm Name</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">Area</th>
              <th className="p-3.5">Soil Type</th>
              <th className="p-3.5">Water Source</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLands.map((land) => (
              <tr
                key={land.id}
                className="hover:bg-emerald-50/30 transition-colors group"
              >
                <td className="p-3.5 font-bold text-slate-900 group-hover:text-[#2E7D32]">
                  {land.farmName}
                </td>
                <td className="p-3.5 text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {land.village}, {land.district}
                  </span>
                </td>
                <td className="p-3.5 font-extrabold text-slate-900 font-serif">
                  {land.areaAcres} Acres
                </td>
                <td className="p-3.5 text-slate-700">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    {land.soilType}
                  </span>
                </td>
                <td className="p-3.5 text-slate-700">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    {land.waterSource}
                  </span>
                </td>
                <td className="p-3.5">
                  <Badge
                    variant={
                      land.status === 'Sown'
                        ? 'green'
                        : land.status === 'Active'
                        ? 'blue'
                        : 'amber'
                    }
                  >
                    {land.status}
                  </Badge>
                </td>
                <td className="p-3.5 text-right space-x-1">
                  <button
                    onClick={() => onView(land)}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(land)}
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Record"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(land)}
                    className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {filteredLands.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No farm land records match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {filteredLands.map((land) => (
          <div
            key={land.id}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{land.farmName}</h4>
                <p className="text-xs text-slate-500">
                  {land.village}, {land.district}, {land.state}
                </p>
              </div>
              <Badge
                variant={
                  land.status === 'Sown'
                    ? 'green'
                    : land.status === 'Active'
                    ? 'blue'
                    : 'amber'
                }
              >
                {land.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
              <div>
                <span className="text-[10px] text-slate-400 block">Area</span>
                <span className="font-bold text-slate-900">{land.areaAcres} Acres</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Soil</span>
                <span className="font-bold text-slate-900">{land.soilType}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
              <Button size="sm" variant="outline" onClick={() => onView(land)}>
                View
              </Button>
              <Button size="sm" variant="outline" onClick={() => onEdit(land)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(land)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
