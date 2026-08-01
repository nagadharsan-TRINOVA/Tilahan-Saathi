import { GovernmentScheme } from '../types';
import { initialSchemes } from '../data/mockSchemes';

export const schemeService = {
  getSchemes: async (): Promise<GovernmentScheme[]> => {
    return initialSchemes;
  },

  applyForScheme: async (
    schemeId: string,
    farmerDetails: { name: string; kisanId: string; phone: string }
  ): Promise<{ applicationId: string; status: string; message: string }> => {
    await new Promise((r) => setTimeout(r, 1000));
    return {
      applicationId: `APP-NMEO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Submitted to Nodal Officer',
      message: `Application submitted successfully for ${farmerDetails.name}. Your reference number has been sent to ${farmerDetails.phone}.`,
    };
  },
};
