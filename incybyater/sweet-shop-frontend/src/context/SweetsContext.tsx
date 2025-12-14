import { createContext, useContext, useEffect, useState } from 'react';
import { getSweets, purchaseSweet } from '../api/sweetsApi';
import { useAuth } from './AuthContext';
import type { Sweet } from '../types/Sweet';

type SweetsContextType = {
  sweets: Sweet[];
  purchase: (id: string) => Promise<void>;
  loading: boolean;
};

const SweetsContext = createContext<SweetsContextType | null>(null);

export const SweetsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSweets = async () => {
      if (!user?.token) {
        setSweets([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getSweets(user.token);
        setSweets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load sweets', error);
        setSweets([]);
      } finally {
        setLoading(false);
      }
    };

    loadSweets();
  }, [user]);

  const purchase = async (id: string) => {
    if (!user?.token) return;

    try {
      await purchaseSweet(id, user.token);
      const updated = await getSweets(user.token);
      setSweets(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Purchase failed', error);
    }
  };

  return (
    <SweetsContext.Provider value={{ sweets, purchase, loading }}>
      {children}
    </SweetsContext.Provider>
  );
};

export const useSweets = () => {
  const context = useContext(SweetsContext);
  if (!context) {
    throw new Error('useSweets must be used within a SweetsProvider');
  }
  return context;
};
