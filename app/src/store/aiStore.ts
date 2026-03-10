'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// ---------- Provider Types ----------

export type AIProvider = 'openai' | 'openrouter' | 'groq' | 'together' | 'fireworks' | 'custom';

export interface ProviderConfig {
    label: string;
    icon: string;
    baseUrl: string;
    defaultModel: string;
    models: { id: string; label: string }[];
    keyPlaceholder: string;
    keyPrefix: string;
    helpUrl: string;
    color: string;
    free?: boolean;
}

export const PROVIDERS: Record<AIProvider, ProviderConfig> = {
    openai: {
        label: 'OpenAI',
        icon: '🤖',
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o-mini',
        models: [
            { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
            { id: 'gpt-4o', label: 'GPT-4o' },
            { id: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
            { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        ],
        keyPlaceholder: 'sk-...',
        keyPrefix: 'sk-',
        helpUrl: 'https://platform.openai.com/api-keys',
        color: '#10a37f',
    },
    openrouter: {
        label: 'OpenRouter',
        icon: '🌐',
        baseUrl: 'https://openrouter.ai/api/v1',
        defaultModel: 'google/gemini-2.0-flash-exp:free',
        models: [
            { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free)' },
            { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Free)' },
            { id: 'deepseek/deepseek-chat-v3-0324:free', label: 'DeepSeek V3 (Free)' },
            { id: 'qwen/qwen3-235b-a22b:free', label: 'Qwen3 235B (Free)' },
            { id: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
            { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
        ],
        keyPlaceholder: 'sk-or-v1-...',
        keyPrefix: 'sk-or-',
        helpUrl: 'https://openrouter.ai/keys',
        color: '#6366f1',
        free: true,
    },
    groq: {
        label: 'Groq',
        icon: '⚡',
        baseUrl: 'https://api.groq.com/openai/v1',
        defaultModel: 'llama-3.3-70b-versatile',
        models: [
            { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
            { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Fast)' },
            { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
            { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
        ],
        keyPlaceholder: 'gsk_...',
        keyPrefix: 'gsk_',
        helpUrl: 'https://console.groq.com/keys',
        color: '#f55036',
        free: true,
    },
    together: {
        label: 'Together',
        icon: '🤝',
        baseUrl: 'https://api.together.xyz/v1',
        defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        models: [
            { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', label: 'Llama 3.3 70B Turbo' },
            { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', label: 'Llama 3.1 8B Turbo' },
            { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen 2.5 72B Turbo' },
            { id: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' },
        ],
        keyPlaceholder: 'together_...',
        keyPrefix: '',
        helpUrl: 'https://api.together.xyz/settings/api-keys',
        color: '#0ea5e9',
    },
    fireworks: {
        label: 'Fireworks',
        icon: '🎆',
        baseUrl: 'https://api.fireworks.ai/inference/v1',
        defaultModel: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
        models: [
            { id: 'accounts/fireworks/models/llama-v3p3-70b-instruct', label: 'Llama 3.3 70B' },
            { id: 'accounts/fireworks/models/qwen2p5-72b-instruct', label: 'Qwen 2.5 72B' },
            { id: 'accounts/fireworks/models/deepseek-v3', label: 'DeepSeek V3' },
        ],
        keyPlaceholder: 'fw_...',
        keyPrefix: 'fw_',
        helpUrl: 'https://fireworks.ai/api-keys',
        color: '#ff6b35',
    },
    custom: {
        label: 'Custom',
        icon: '🔧',
        baseUrl: '',
        defaultModel: '',
        models: [],
        keyPlaceholder: 'your-api-key',
        keyPrefix: '',
        helpUrl: '',
        color: '#8b5cf6',
    },
};

// ---------- Chat Message ----------

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    isGenerating?: boolean;
}

// ---------- State ----------

interface AIState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    isOpen: boolean;

    // Provider config
    apiKey: string;
    provider: AIProvider;
    model: string;
    customBaseUrl: string;

    // Actions
    addMessage: (role: ChatMessage['role'], content: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    toggleOpen: () => void;
    setOpen: (open: boolean) => void;
    clearChat: () => void;
    setApiKey: (key: string) => void;
    setProvider: (provider: AIProvider) => void;
    setModel: (model: string) => void;
    setCustomBaseUrl: (url: string) => void;
    updateLastAssistantMessage: (content: string) => void;
}

// ---------- Helpers ----------

function loadFromLS(key: string, fallback: string): string {
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(key) || fallback;
}

function saveToLS(key: string, value: string) {
    if (typeof window !== 'undefined') localStorage.setItem(key, value);
}

// ---------- Store ----------

export const useAIStore = create<AIState>((set, get) => ({
    messages: [],
    isLoading: false,
    error: null,
    isOpen: false,

    apiKey: loadFromLS('g3engine_ai_key', ''),
    provider: loadFromLS('g3engine_ai_provider', 'openrouter') as AIProvider,
    model: loadFromLS('g3engine_ai_model', PROVIDERS.openrouter.defaultModel),
    customBaseUrl: loadFromLS('g3engine_ai_custom_url', ''),

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
        saveToLS('g3engine_ai_key', key);
        set({ apiKey: key });
    },

    setProvider: (provider) => {
        saveToLS('g3engine_ai_provider', provider);
        const defaultModel = PROVIDERS[provider].defaultModel;
        saveToLS('g3engine_ai_model', defaultModel);
        set({ provider, model: defaultModel });
    },

    setModel: (model) => {
        saveToLS('g3engine_ai_model', model);
        set({ model });
    },

    setCustomBaseUrl: (url) => {
        saveToLS('g3engine_ai_custom_url', url);
        set({ customBaseUrl: url });
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
