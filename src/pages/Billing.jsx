import React from 'react';
import DashboardLayout from '../Components/DashboardLayout';
import BillEditPage from './admin/BillEditPage';

const Billing = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Billing Section</h2>
      <p>All your billing history and payment settings will appear here.</p>
      <BillEditPage />
    </DashboardLayout>
  );
};

export default Billing;
