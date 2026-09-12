import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StyleLensProvider } from './context/StyleLensContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { UnifiedStudio } from './pages/UnifiedStudio';
import { LandingPage } from './pages/LandingPage';
import { QuizPage } from './pages/QuizPage';
import { UploadPage } from './pages/UploadPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { TryOnPage } from './pages/TryOnPage';
import { TrendsPage } from './pages/TrendsPage';
import { ChecklistPage } from './pages/ChecklistPage';

export const App: React.FC = () => {
  return (
    <StyleLensProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-noir-950 text-white flex flex-col font-sans selection:bg-luxe-gold selection:text-noir-950">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<UnifiedStudio />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/try-on/:productId" element={<TryOnPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </StyleLensProvider>
  );
};
