import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { GovernmentScheme } from '../../types';
import { schemeService } from '../../services/schemeService';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle2, FileText, Send, Building2, ShieldCheck, Download } from 'lucide-react';

interface SchemeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: GovernmentScheme | null;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  isOpen,
  onClose,
  scheme,
}) => {
  const { profile, addToast } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!scheme) return null;

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      const res = await schemeService.applyForScheme(scheme.id, {
        name: profile?.name || 'Ramesh Patel',
        kisanId: profile?.kisanId || 'KSN-2026-98421',
        phone: profile?.phone || '+91 98765 43210',
      });
      setSubmittedRef(res.applicationId);
      addToast({
        type: 'success',
        title: 'Application Submitted!',
        message: res.message,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: 'Could not process application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSubmittedRef(null);
        onClose();
      }}
      title={scheme.schemeName}
      subtitle={scheme.hindiName || scheme.nodalAgency}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {submittedRef ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Application Successfully Submitted!
            </h3>
            <p className="text-xs text-slate-600">
              Your application has been logged with the District Agriculture Office under NMEO-Oilseeds guidelines.
            </p>
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900">
              Reference ID: {submittedRef}
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setSubmittedRef(null);
                onClose();
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* Benefits & Subsidy Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white space-y-2">
              <span className="text-[10px] font-bold text-[#FFB300] uppercase tracking-wider block">
                Financial Grant & Benefits
              </span>
              <p className="text-sm font-semibold text-emerald-100 leading-relaxed">
                {scheme.benefits}
              </p>
              <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-xs">
                <span>Maximum Benefit Grant:</span>
                <span className="font-extrabold text-[#FFB300] font-serif text-sm">
                  {scheme.subsidyAmountMax}
                </span>
              </div>
            </div>

            {/* Eligibility */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-800">
                Eligibility Criteria:
              </h4>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {scheme.eligibility}
              </p>
            </div>

            {/* Required Documents */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-emerald-800">
                Required Documents Checklist:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2 text-slate-800"
                  >
                    <FileText className="w-4 h-4 text-[#2E7D32]" />
                    <span className="font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Farmer Auto-fill info */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Auto-filled from Kisan ID: <strong>{profile?.kisanId}</strong> ({profile?.name})</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>

              <Button
                variant="accent"
                icon={Send}
                isLoading={isSubmitting}
                onClick={handleApply}
              >
                Submit Subsidy Application
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
