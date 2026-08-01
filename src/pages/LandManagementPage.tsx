import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LandTable } from '../components/land/LandTable';
import { AddEditLandModal } from '../components/land/AddEditLandModal';
import { LandDetailModal } from '../components/land/LandDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LandRecord } from '../types';
import { landService } from '../services/landService';

export const LandManagementPage: React.FC = () => {
  const { lands, refreshLands, addToast } = useApp();

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<LandRecord | null>(null);

  const [detailLand, setDetailLand] = useState<LandRecord | null>(null);
  const [deleteLand, setDeleteLand] = useState<LandRecord | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveLand = async (data: Omit<LandRecord, 'id' | 'lastUpdated'>) => {
    setIsSaving(true);
    try {
      if (editingLand) {
        await landService.updateLand(editingLand.id, data);
        addToast({
          type: 'success',
          title: 'Land Record Updated',
          message: `${data.farmName} profile updated successfully.`,
        });
      } else {
        await landService.addLand(data);
        addToast({
          type: 'success',
          title: 'Land Record Created',
          message: `${data.farmName} registered in system.`,
        });
      }
      await refreshLands();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not save land record.',
      });
    } finally {
      setIsSaving(false);
      setEditingLand(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteLand) return;
    setIsDeleting(true);
    try {
      await landService.deleteLand(deleteLand.id);
      addToast({
        type: 'info',
        title: 'Land Record Deleted',
        message: `${deleteLand.farmName} removed.`,
      });
      await refreshLands();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not delete land record.',
      });
    } finally {
      setIsDeleting(false);
      setDeleteLand(null);
    }
  };

  return (
    <div className="space-y-6">
      <LandTable
        lands={lands}
        onAdd={() => {
          setEditingLand(null);
          setIsAddEditOpen(true);
        }}
        onView={(land) => setDetailLand(land)}
        onEdit={(land) => {
          setEditingLand(land);
          setIsAddEditOpen(true);
        }}
        onDelete={(land) => setDeleteLand(land)}
      />

      <AddEditLandModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingLand(null);
        }}
        onSave={handleSaveLand}
        initialData={editingLand}
        isLoading={isSaving}
      />

      <LandDetailModal
        isOpen={!!detailLand}
        onClose={() => setDetailLand(null)}
        land={detailLand}
      />

      <ConfirmDialog
        isOpen={!!deleteLand}
        onClose={() => setDeleteLand(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Farm Land Record"
        message={`Are you sure you want to delete ${deleteLand?.farmName}? Associated crop history will also be removed.`}
        isLoading={isDeleting}
      />
    </div>
  );
};
