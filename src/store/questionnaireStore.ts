import { create } from 'zustand';
import { QuestionnaireState, Answer, Identity, OutputType, AssessmentResult } from '../types/questionnaire';
import { getIdentityRole } from '../types/identity';

interface QuestionnaireStore extends QuestionnaireState {
  setIdentity: (identity: Identity) => void;
  setOutputs: (outputs: OutputType[]) => void;
  addAnswer: (answer: Answer) => void;
  updateAnswer: (questionId: string, value: any, text?: string) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
  result: AssessmentResult | null;
  setResult: (result: AssessmentResult) => void;
}

const initialState: QuestionnaireState = {
  identity: null,
  outputs: [],
  answers: [],
  currentStep: -1, // 从预告页开始
};

export const useQuestionnaireStore = create<QuestionnaireStore>((set) => ({
  ...initialState,
  result: null,
  
  setIdentity: (identity) => set({ identity }),
  
  setOutputs: (outputs) => set({ outputs }),
  
  addAnswer: (answer) =>
    set((state) => ({
      answers: [...state.answers.filter((a) => a.questionId !== answer.questionId), answer],
    })),
  
  updateAnswer: (questionId, value, text) =>
    set((state) => {
      const existing = state.answers.find((a) => a.questionId === questionId);
      if (existing) {
        return {
          answers: state.answers.map((a) =>
            a.questionId === questionId ? { ...a, value, text } : a
          ),
        };
      }
      return {
        answers: [...state.answers, { questionId, value, text }],
      };
    }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setResult: (result) => set({ result }),
  
  reset: () => set({ ...initialState, result: null }),
}));

