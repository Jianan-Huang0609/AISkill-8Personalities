import { createContext, useContext, ReactNode } from 'react';
import { IdentityRole, QuestionTrack, getIdentityRole } from '../types/identity';
import { useQuestionnaireStore } from '../store/questionnaireStore';

interface IdentityContextType {
  identity: IdentityRole | null;
  setIdentity: (name: string) => void;
  track: QuestionTrack | null;
  weights: IdentityRole['weights'] | null;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const storeIdentity = useQuestionnaireStore(state => state.identity);
  const setStoreIdentity = useQuestionnaireStore(state => state.setIdentity);
  
  const identityRole = storeIdentity ? getIdentityRole(storeIdentity) : undefined;
  const identity: IdentityRole | null = identityRole || null;
  const track = identity?.track || null;
  const weights = identity?.weights || null;

  const setIdentity = (name: string) => {
    setStoreIdentity(name as any);
  };

  return (
    <IdentityContext.Provider value={{ identity, setIdentity, track, weights }}>
      {children}
    </IdentityContext.Provider>
  );
}

export const useIdentity = () => {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error('useIdentity must be used within IdentityProvider');
  }
  return context;
};

