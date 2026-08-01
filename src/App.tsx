import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LandManagementPage } from './pages/LandManagementPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { RecommendationResultPage } from './pages/RecommendationResultPage';
import { CropCalendarPage } from './pages/CropCalendarPage';
import { WeatherAdvisoryPage } from './pages/WeatherAdvisoryPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { InputStorePage } from './pages/InputStorePage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';

function ProtectedAppLayout() {
  const { isAuthenticated } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF5] text-slate-900 font-sans flex flex-col selection:bg-[#2E7D32] selection:text-white">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/land-management" element={<LandManagementPage />} />
            <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
            <Route
              path="/recommendation-result/:id?"
              element={<RecommendationResultPage />}
            />
            <Route path="/crop-calendar" element={<CropCalendarPage />} />
            <Route path="/weather" element={<WeatherAdvisoryPage />} />
            <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
            <Route path="/store" element={<InputStorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <div className="min-h-screen bg-[#F8FAF5] text-slate-900 font-sans p-4 sm:p-6 flex flex-col justify-center items-center">
              <LoginPage />
              <ToastContainer />
            </div>
          )
        }
      />
      <Route path="/*" element={<ProtectedAppLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
