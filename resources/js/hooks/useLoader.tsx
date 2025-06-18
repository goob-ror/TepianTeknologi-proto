import { useState, useCallback } from 'react';

interface UseLoaderReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

export function useLoader(initialState: boolean = false): UseLoaderReturn {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      const result = await asyncFn();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  };
}

// Global loading context for app-wide loading states
import { createContext, useContext, ReactNode } from 'react';

interface LoadingContextType {
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  globalLoadingText: string;
  setGlobalLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalLoadingText, setGlobalLoadingText] = useState('Memuat...');

  const setGlobalLoading = useCallback((loading: boolean) => {
    setIsGlobalLoading(loading);
  }, []);

  const setGlobalLoadingTextCallback = useCallback((text: string) => {
    setGlobalLoadingText(text);
  }, []);

  return (
    <LoadingContext.Provider value={{
      isGlobalLoading,
      setGlobalLoading,
      globalLoadingText,
      setGlobalLoadingText: setGlobalLoadingTextCallback
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoader() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useGlobalLoader must be used within a LoadingProvider');
  }
  return context;
}
