import React, { createContext, useContext, useState, useEffect } from 'react';
import { QuizState, Product, BodyTypeAnalysis } from '../types/stylelens';
import defaultProducts from '../../server/data/products.json';
import { analyzeSilhouette } from '../services/bodyTypeAnalyzer';

interface SavedLook {
  id: string;
  userPhoto: string;
  garment: Product;
  savedAt: string;
}

interface StyleLensContextType {
  quiz: QuizState;
  setQuiz: React.Dispatch<React.SetStateAction<QuizState>>;
  userPhoto: string | null;
  setUserPhoto: (photo: string | null) => void;
  bodyTypeAnalysis: BodyTypeAnalysis | null;
  setBodyTypeAnalysis: (analysis: BodyTypeAnalysis | null) => void;
  currentStudioStep: number;
  setCurrentStudioStep: (step: number) => void;
  recommendations: Product[];
  setRecommendations: React.Dispatch<React.SetStateAction<Product[]>>;
  matchedRetailer: string;
  setMatchedRetailer: (retailer: string) => void;
  curatorInsight: string;
  setCuratorInsight: (insight: string) => void;
  savedLooks: SavedLook[];
  saveLook: (garment: Product, userPhoto: string) => void;
  removeSavedLook: (id: string) => void;
  resetApp: () => void;
}

const DEFAULT_QUIZ: QuizState = {
  budget: 'low',
  style: 'streetwear',
  category: 'outfit',
  gender: 'women',
  size: 'M',
  occasion: 'Everyday Street Style',
  completed: false
};

// Default sample user photo for zero-effort instant demoing
export const SAMPLE_USER_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

const StyleLensContext = createContext<StyleLensContextType | undefined>(undefined);

export const StyleLensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quiz, setQuiz] = useState<QuizState>(() => {
    const saved = localStorage.getItem('stylelens_quiz');
    return saved ? JSON.parse(saved) : DEFAULT_QUIZ;
  });

  const [userPhoto, setUserPhotoState] = useState<string | null>(() => {
    return localStorage.getItem('stylelens_user_photo') || SAMPLE_USER_PHOTO;
  });

  const [bodyTypeAnalysis, setBodyTypeAnalysis] = useState<BodyTypeAnalysis | null>(() => {
    return analyzeSilhouette(SAMPLE_USER_PHOTO);
  });

  const [currentStudioStep, setCurrentStudioStep] = useState<number>(1);

  const [recommendations, setRecommendations] = useState<Product[]>(() => {
    return (defaultProducts as Product[]).filter((p) => p.budgetTier === 'low');
  });

  const [matchedRetailer, setMatchedRetailer] = useState<string>('Zara (Low Budget)');
  const [curatorInsight, setCuratorInsight] = useState<string>(
    'Matched to Zara for trend-forward silhouettes and budget accessibility.'
  );

  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => {
    const saved = localStorage.getItem('stylelens_saved_looks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('stylelens_quiz', JSON.stringify(quiz));
  }, [quiz]);

  useEffect(() => {
    if (userPhoto) {
      // Avoid blowing localStorage quota if base64 is huge
      try {
        localStorage.setItem('stylelens_user_photo', userPhoto);
      } catch {
        // quota exceeded fallback
      }
    }
  }, [userPhoto]);

  useEffect(() => {
    localStorage.setItem('stylelens_saved_looks', JSON.stringify(savedLooks));
  }, [savedLooks]);

  const setUserPhoto = (photo: string | null) => {
    setUserPhotoState(photo);
    if (photo) {
      const analysis = analyzeSilhouette(photo);
      setBodyTypeAnalysis(analysis);
      setQuiz((prev) => ({
        ...prev,
        bodyType: analysis.bodyType,
        bodyTypeAnalysis: analysis
      }));
    }
  };

  const saveLook = (garment: Product, photo: string) => {
    const exists = savedLooks.some((l) => l.garment.id === garment.id);
    if (!exists) {
      const newLook: SavedLook = {
        id: `look-${Date.now()}`,
        userPhoto: photo,
        garment,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSavedLooks((prev) => [newLook, ...prev]);
    }
  };

  const removeSavedLook = (id: string) => {
    setSavedLooks((prev) => prev.filter((l) => l.id !== id));
  };

  const resetApp = () => {
    setQuiz(DEFAULT_QUIZ);
    setUserPhotoState(SAMPLE_USER_PHOTO);
    setBodyTypeAnalysis(analyzeSilhouette(SAMPLE_USER_PHOTO));
    setCurrentStudioStep(1);
    setRecommendations((defaultProducts as Product[]).filter((p) => p.budgetTier === 'low'));
    setMatchedRetailer('Zara (Low Budget)');
  };

  return (
    <StyleLensContext.Provider
      value={{
        quiz,
        setQuiz,
        userPhoto,
        setUserPhoto,
        bodyTypeAnalysis,
        setBodyTypeAnalysis,
        currentStudioStep,
        setCurrentStudioStep,
        recommendations,
        setRecommendations,
        matchedRetailer,
        setMatchedRetailer,
        curatorInsight,
        setCuratorInsight,
        savedLooks,
        saveLook,
        removeSavedLook,
        resetApp
      }}
    >
      {children}
    </StyleLensContext.Provider>
  );
};

export const useStyleLens = () => {
  const context = useContext(StyleLensContext);
  if (!context) {
    throw new Error('useStyleLens must be used within a StyleLensProvider');
  }
  return context;
};
