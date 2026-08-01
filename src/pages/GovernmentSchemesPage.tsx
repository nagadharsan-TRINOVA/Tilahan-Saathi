import React from 'react';
import { SchemeCardList } from '../components/schemes/SchemeCard';

export const GovernmentSchemesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <SchemeCardList />
    </div>
  );
};
