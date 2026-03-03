'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// ---------- Types ----------

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    isGenerating?: boolean; // true when AI is building game objects
}

interface AIState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    isOpen: boolean;
    apiKey: string;

    // Actions
    addMessage: (role: ChatMessage['role'], content: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    toggleOpen: () => void;
    setOpen: (open: boolean) => void;
    clearChat: () => void;
    setApiKey: (key: string) => void;
    updateLastAssistantMessage: (content: string) => void;
}

// ---------- Store ----------

export const useAIStore = create<AIState>((set, get) => ({
    messages: [],
    isLoading: false,
    error: null,
    isOpen: false,
    apiKey: typeof window !== 'undefined' ? localStorage.getItem('g3engine_ai_key') || '' : '',

    addMessage: (role, content) => {
        const msg: ChatMessage = {
            id: uuidv4(),
            role,
            content,
            timestamp: Date.now(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
    },

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
    setOpen: (open) => set({ isOpen: open }),

    clearChat: () => set({ messages: [], error: null }),

    setApiKey: (key) => {
        if (typeof window !== 'undefined') localStorage.setItem('g3engine_ai_key', key);
        set({ apiKey: key });
    },

    updateLastAssistantMessage: (content) => set((s) => {
        const msgs = [...s.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === 'assistant') {
                msgs[i] = { ...msgs[i], content };
                break;
            }
        }
        return { messages: msgs };
    }),
}));
