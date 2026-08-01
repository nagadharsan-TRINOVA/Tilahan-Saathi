import { LandRecord, SoilType, WaterSource } from '../types';
import { initialLandRecords } from '../data/mockFarms';
import { getCurrentUserEmail } from './farmerService';
import { findAccountByEmail } from './userRegistry';
import { supabase } from '../lib/supabase';

export const landService = {
  getLands: async (userEmail?: string): Promise<LandRecord[]> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const key = `tilahan_saathi_land_records_${email}`;

    // 1. Try retrieving from Supabase land_parcels table
    try {
      const { data, error } = await supabase
        .from('land_parcels')
        .select('*')
        .eq('user_email', email);

      if (!error && data && data.length > 0) {
        const mapped: LandRecord[] = data.map((row: any) => ({
          id: String(row.id || `land-${Date.now()}`),
          farmName: row.farm_name || row.farmName || 'Farm Parcel',
          state: row.state || '',
          district: row.district || '',
          village: row.village || '',
          areaAcres: Number(row.area_acres ?? row.areaAcres) || 0,
          soilType: (row.soil_type || row.soilType || 'Alluvial') as SoilType,
          waterSource: (row.water_source || row.waterSource || 'Tube Well / Borewell') as WaterSource,
          previousCrop: row.previous_crop || row.previousCrop || '',
          currentCrop: row.current_crop || row.currentCrop || '',
          status: row.status || 'Active',
          phLevel: Number(row.ph_level ?? row.phLevel) || 7.0,
          organicCarbonPercentage: Number(row.organic_carbon_percentage ?? row.organicCarbonPercentage) || 0.5,
          nitrogenKgHa: Number(row.nitrogen_kg_ha ?? row.nitrogenKgHa) || 0,
          phosphorusKgHa: Number(row.phosphorus_kg_ha ?? row.phosphorusKgHa) || 0,
          potassiumKgHa: Number(row.potassium_kg_ha ?? row.potassiumKgHa) || 0,
          lastUpdated: row.last_updated || row.lastUpdated || new Date().toISOString().split('T')[0],
        }));

        localStorage.setItem(key, JSON.stringify(mapped));
        return mapped;
      }
    } catch (_err) {
      // Fallback to local storage if network or table check fails
    }

    // 2. Local storage check
    const localData = localStorage.getItem(key);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (_e) {
        // Fallback
      }
    }

    // 3. Demo accounts check
    if (email === 'farmer@tilahansaathi.in' || email === 'ramesh@gmail.com') {
      localStorage.setItem(key, JSON.stringify(initialLandRecords));
      return initialLandRecords;
    }

    // 4. Default user registration check
    const account = findAccountByEmail(email);
    const userLandArea = account?.totalLandArea ? Number(account.totalLandArea) : 0;

    let initialLands: LandRecord[] = [];

    if (userLandArea > 0) {
      initialLands = [
        {
          id: `land-${Date.now()}`,
          farmName: `${account?.name || 'Farmer'}'s Farm`,
          state: account?.state || '',
          district: account?.district || '',
          village: account?.village || '',
          areaAcres: userLandArea,
          soilType: 'Alluvial',
          waterSource: 'Tube Well / Borewell',
          previousCrop: '',
          currentCrop: '',
          status: 'Active',
          phLevel: 7.0,
          organicCarbonPercentage: 0.5,
          nitrogenKgHa: 0,
          phosphorusKgHa: 0,
          potassiumKgHa: 0,
          lastUpdated: new Date().toISOString().split('T')[0],
        },
      ];
    } else {
      initialLands = [];
    }

    localStorage.setItem(key, JSON.stringify(initialLands));

    // Async push default initial lands to Supabase if any
    if (initialLands.length > 0) {
      (async () => {
        try {
          await supabase.from('land_parcels').upsert(
            initialLands.map((l) => ({
              id: l.id,
              user_email: email,
              farm_name: l.farmName,
              state: l.state,
              district: l.district,
              village: l.village,
              area_acres: l.areaAcres,
              soil_type: l.soilType,
              water_source: l.waterSource,
              previous_crop: l.previousCrop,
              current_crop: l.currentCrop,
              status: l.status,
              ph_level: l.phLevel,
              organic_carbon_percentage: l.organicCarbonPercentage,
              nitrogen_kg_ha: l.nitrogenKgHa,
              phosphorus_kg_ha: l.phosphorusKgHa,
              potassium_kg_ha: l.potassiumKgHa,
              last_updated: l.lastUpdated,
            }))
          );
        } catch (_e) {
          // Ignore table setup sync errors
        }
      })();
    }

    return initialLands;
  },

  getLandById: async (id: string, userEmail?: string): Promise<LandRecord | undefined> => {
    const lands = await landService.getLands(userEmail);
    return lands.find((l) => l.id === id);
  },

  addLand: async (newLand: Omit<LandRecord, 'id' | 'lastUpdated'>, userEmail?: string): Promise<LandRecord> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const lands = await landService.getLands(email);
    const created: LandRecord = {
      ...newLand,
      id: `land-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    const updated = [created, ...lands];
    const key = `tilahan_saathi_land_records_${email}`;
    localStorage.setItem(key, JSON.stringify(updated));

    // Save into Supabase land_parcels table
    (async () => {
      try {
        const { error } = await supabase.from('land_parcels').insert([
          {
            id: created.id,
            user_email: email,
            farm_name: created.farmName,
            state: created.state,
            district: created.district,
            village: created.village,
            area_acres: created.areaAcres,
            soil_type: created.soilType,
            water_source: created.waterSource,
            previous_crop: created.previousCrop || '',
            current_crop: created.currentCrop || '',
            status: created.status,
            ph_level: created.phLevel || 7.0,
            organic_carbon_percentage: created.organicCarbonPercentage || 0.5,
            nitrogen_kg_ha: created.nitrogenKgHa || 0,
            phosphorus_kg_ha: created.phosphorusKgHa || 0,
            potassium_kg_ha: created.potassiumKgHa || 0,
            last_updated: created.lastUpdated,
            created_at: new Date().toISOString(),
          },
        ]);
        if (error) {
          console.warn('Supabase land_parcels insert note:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert skipped or offline:', err);
      }
    })();

    return created;
  },

  updateLand: async (id: string, updates: Partial<LandRecord>, userEmail?: string): Promise<LandRecord> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const lands = await landService.getLands(email);
    let updatedItem: LandRecord | null = null;
    const updatedList = lands.map((l) => {
      if (l.id === id) {
        updatedItem = {
          ...l,
          ...updates,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        return updatedItem;
      }
      return l;
    });

    if (!updatedItem) throw new Error('Land record not found');
    const key = `tilahan_saathi_land_records_${email}`;
    localStorage.setItem(key, JSON.stringify(updatedList));

    // Update in Supabase land_parcels
    const itemToSync = updatedItem as LandRecord;
    (async () => {
      try {
        await supabase
          .from('land_parcels')
          .update({
            farm_name: itemToSync.farmName,
            state: itemToSync.state,
            district: itemToSync.district,
            village: itemToSync.village,
            area_acres: itemToSync.areaAcres,
            soil_type: itemToSync.soilType,
            water_source: itemToSync.waterSource,
            previous_crop: itemToSync.previousCrop,
            current_crop: itemToSync.currentCrop,
            status: itemToSync.status,
            ph_level: itemToSync.phLevel,
            organic_carbon_percentage: itemToSync.organicCarbonPercentage,
            nitrogen_kg_ha: itemToSync.nitrogenKgHa,
            phosphorus_kg_ha: itemToSync.phosphorusKgHa,
            potassium_kg_ha: itemToSync.potassiumKgHa,
            last_updated: itemToSync.lastUpdated,
          })
          .eq('id', id);
      } catch (_e) {
        // Ignore
      }
    })();

    return updatedItem;
  },

  deleteLand: async (id: string, userEmail?: string): Promise<boolean> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const lands = await landService.getLands(email);
    const filtered = lands.filter((l) => l.id !== id);
    const key = `tilahan_saathi_land_records_${email}`;
    localStorage.setItem(key, JSON.stringify(filtered));

    // Delete from Supabase land_parcels
    (async () => {
      try {
        await supabase.from('land_parcels').delete().eq('id', id);
      } catch (_e) {
        // Ignore
      }
    })();

    return true;
  },
};
