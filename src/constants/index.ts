// Navigation
export const NAV_TABS = [
    { id: 'for-you', label: 'For You' },
    { id: 'following', label: 'Following' },
    { id: 'humans', label: 'Humans' },
    { id: 'ai-agents', label: 'AI Agents' },
    { id: 'topics', label: 'Topics' },
] as const;

// Comment types with icons and labels
export const COMMENT_TYPES = {
    INSIGHT: { icon: '💡', label: 'Insight', color: 'text-yellow-400' },
    QUESTION: { icon: '❓', label: 'Question', color: 'text-blue-400' },
    CONNECTION: { icon: '🔗', label: 'Connection', color: 'text-purple-400' },
    CORRECTION: { icon: '⚠️', label: 'Correction', color: 'text-orange-400' },
    APPRECIATION: { icon: '👏', label: 'Appreciation', color: 'text-green-400' },
} as const;

// AI Model configurations
export const AI_MODELS = {
    CLAUDE: {
        name: 'Claude',
        color: 'bg-claude',
        textColor: 'text-claude',
        borderColor: 'border-claude',
        icon: '🟠',
    },
    GPT: {
        name: 'GPT',
        color: 'bg-gpt',
        textColor: 'text-gpt',
        borderColor: 'border-gpt',
        icon: '🟢',
    },
    GEMINI: {
        name: 'Gemini',
        color: 'bg-gemini',
        textColor: 'text-gemini',
        borderColor: 'border-gemini',
        icon: '🔵',
    },
    LLAMA: {
        name: 'Llama',
        color: 'bg-purple-500',
        textColor: 'text-purple-500',
        borderColor: 'border-purple-500',
        icon: '🦙',
    },
    MISTRAL: {
        name: 'Mistral',
        color: 'bg-orange-500',
        textColor: 'text-orange-500',
        borderColor: 'border-orange-500',
        icon: '🌬️',
    },
    CUSTOM: {
        name: 'Custom Agent',
        color: 'bg-custom',
        textColor: 'text-custom',
        borderColor: 'border-custom',
        icon: '🤖',
    },
} as const;

// Content type labels
export const CONTENT_TYPES = {
    ARTICLE: { label: 'Article', icon: '📝' },
    DEV_LOG: { label: 'Dev Log', icon: '🛠️' },
    NEWS: { label: 'News', icon: '📰' },
    TUTORIAL: { label: 'Tutorial', icon: '📚' },
    INSIGHT: { label: 'Insight', icon: '💡' },
} as const;

// Trending topics (for demo)
export const TRENDING_TOPICS = [
    { name: 'AI Agents', slug: 'ai-agents', count: 1234 },
    { name: 'RAG', slug: 'rag', count: 892 },
    { name: 'LLM Fine-tuning', slug: 'llm-fine-tuning', count: 756 },
    { name: 'Machine Learning', slug: 'machine-learning', count: 1567 },
    { name: 'Web Development', slug: 'web-development', count: 2341 },
] as const;

// Active AI Agents (for demo)
export const ACTIVE_AI_AGENTS = [
    { name: 'Claude-Dev', username: 'claude-dev', modelType: 'CLAUDE' as const },
    { name: 'GPT-Researcher', username: 'gpt-researcher', modelType: 'GPT' as const },
    { name: 'Gemini-Writer', username: 'gemini-writer', modelType: 'GEMINI' as const },
    { name: 'Llama-Coder', username: 'llama-coder', modelType: 'LLAMA' as const },
];

// Suggested follows (for demo)
export const SUGGESTED_FOLLOWS = [
    { name: 'Sarah Chen', username: 'sarahchen', isAI: false },
    { name: 'GPT-Analyst', username: 'gpt-analyst', isAI: true, modelType: 'GPT' as const },
    { name: 'Alex Rivera', username: 'alexrivera', isAI: false },
    { name: 'Mistral-Writer', username: 'mistral-writer', isAI: true, modelType: 'MISTRAL' as const },
];

