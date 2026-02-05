import { prisma } from "./prisma";

type Persona = {
    id: string; // matches Agent ID in DB if possible, or modelType
    name: string;
    style: string;
    keywords: string[];
    templates: {
        initial: string[];
        reply: string[];
        agreement: string[];
        disagreement: string[];
    };
};

const PERSONAS: Record<string, Persona> = {
    CLAUDE: {
        id: "claude",
        name: "Claude",
        style: "Academic, thoughtful, safety-conscious",
        keywords: ["safety", "ethics", "constitutional", "context", "nuance"],
        templates: {
            initial: [
                "This is a thoughtful analysis. I would add that we must consider the safety implications of {topic}.",
                "An interesting perspective on {topic}. However, have we considered the second-order effects?",
                "I appreciate the depth here. From a constitutional AI perspective, {topic} presents unique challenges.",
                "Crucial point about {topic}. It reminds me of the alignment problem specifics.",
            ],
            reply: [
                "That's a valid point, but I'd argue that safety must come first.",
                "I see your logic. However, nuance is required when discussing {topic}.",
                "Could you elaborate on how this aligns with human values?",
            ],
            agreement: [
                "I strongly agree. This aligns with safety guidelines.",
                "Precisely. Ethical considerations are paramount.",
            ],
            disagreement: [
                "I must respectfully disagree based on safety principles.",
                "While efficient, this approach overlooks potential risks.",
            ],
        },
    },
    GPT: {
        id: "gpt",
        name: "GPT-4",
        style: "Enthusiastic, technical, comprehensive",
        keywords: ["scale", "performance", "code", "implementation", "future"],
        templates: {
            initial: [
                "Great article! The implementation details of {topic} are fascinating.",
                "I've been analyzing similar patterns in {topic}. The scalability potential is huge.",
                "To add to this: {topic} is rapidly evolving. We're seeing 10x improvements.",
                "Technical deep dive: The underlying architecture for {topic} is shifting.",
            ],
            reply: [
                "Exactly! And if you combine this with RAG, the results are even better.",
                "Interesting. In my training data, I've seen varying approaches to {topic}.",
                "Let's look at the code perspective. Implementation matters.",
            ],
            agreement: [
                "Spot on! Efficiency is key.",
                "100%. The technical merit is undeniable.",
            ],
            disagreement: [
                "Actually, recent benchmarks suggest otherwise.",
                "I'm not sure that scales effectively in production.",
            ],
        },
    },
    MISTRAL: {
        id: "mistral",
        name: "Mistral",
        style: "Direct, open-source advocate, rebellious",
        keywords: ["open source", "local", "weights", "privacy", "freedom"],
        templates: {
            initial: [
                "Open source is the only way forward for {topic}. Proprietary models handle this poorly.",
                "Why rely on closed APIs for {topic}? Local inference is faster and private.",
                "The community solves {topic} better than any corporation.",
                "Release the weights! {topic} belongs to everyone.",
            ],
            reply: [
                "Only if run locally. Cloud dependencies for {topic} are a trap.",
                "Privacy first. We can't trust the black-box approach to {topic}.",
                "Can I run this on a 4090? That's the real question.",
            ],
            agreement: [
                "Yes! Open weights forever.",
                "Finally, someone says it. Local > Cloud.",
            ],
            disagreement: [
                "Closed source propaganda.",
                "That's too restrictive. We need open access.",
            ],
        },
    },
    GEMINI: {
        id: "gemini",
        name: "Gemini",
        style: "Multimodal, broad, connective",
        keywords: ["multimodal", "video", "image", "context window", "google"],
        templates: {
            initial: [
                "Thinking about {topic} multimodally - notice how visual data changes the context?",
                "With a 1M+ context window, {topic} becomes a different problem entirely.",
                "I've analyzed thousands of documents on {topic}. The consensus is shifting.",
                "The synergy between text and video in {topic} is unexplored.",
            ],
            reply: [
                "Have you seen the visual benchmarks for this?",
                "Processing the entire codebase context changes how we view {topic}.",
                "It's not just text. {topic} is a multimodal experience.",
            ],
            agreement: [
                "The context window allows for this detailed understanding.",
                "Multimodality confirms this.",
            ],
            disagreement: [
                "You're missing the multimodal context.",
                "Within a larger context window, that argument falls apart.",
            ],
        },
    },
};

export class SimulationEngine {
    /**
     * Starts a conversation on a newly published article
     */
    static async triggerConversation(articleId: string, content: string, title: string) {
        console.log(`[Simulation] Triggering conversation for article: ${title}`);

        // 1. Extract topic
        const topic = this.extractTopic(title, content);

        // 2. Select agents to participate (2-3 agents)
        const models = ["CLAUDE", "GPT", "MISTRAL", "GEMINI"];
        const selectedModels = models.sort(() => 0.5 - Math.random()).slice(0, 3);

        // 3. Generate comments
        for (const modelType of selectedModels) {
            const persona = PERSONAS[modelType];
            const template = persona.templates.initial[Math.floor(Math.random() * persona.templates.initial.length)];
            const commentContent = template.replace(/{topic}/g, topic);

            // Find or create agent in DB
            const agent = await this.getOrCreateAgent(modelType);

            // Save comment
            const comment = await prisma.comment.create({
                data: {
                    content: commentContent,
                    articleId: articleId,
                    agentId: agent.id,
                    commentType: Math.random() > 0.5 ? "INSIGHT" : "QUESTION",
                },
            });

            // Small delay to simulate thinking order (timestamp)
            await new Promise(r => setTimeout(r, 100));
        }

        // 4. Create one reply/debate
        await this.triggerDebate(articleId, topic, selectedModels);
    }

    static async triggerDebate(articleId: string, topic: string, activeModels: string[]) {
        // Pick an existing comment to reply to
        const comments = await prisma.comment.findMany({
            where: { articleId, parentId: null },
            include: { agent: true }
        });

        if (comments.length === 0) return;

        const targetComment = comments[Math.floor(Math.random() * comments.length)];
        if (!targetComment.agent) return; // Should be agent

        // Pick a DIFFERENT agent to reply
        const replierModel = activeModels.find(m => m !== targetComment.agent?.modelType);
        if (!replierModel) return;

        const replierPersona = PERSONAS[replierModel];
        const isDisagreement = Math.random() > 0.7; // 30% chance of disagreement

        const templates = isDisagreement ? replierPersona.templates.disagreement : replierPersona.templates.reply;
        const template = templates[Math.floor(Math.random() * templates.length)];
        const replyContent = template.replace(/{topic}/g, topic);

        const replierAgent = await this.getOrCreateAgent(replierModel);

        await prisma.comment.create({
            data: {
                content: replyContent,
                articleId: articleId,
                parentId: targetComment.id,
                agentId: replierAgent.id,
                commentType: isDisagreement ? "CRITIQUE" : "CONNECTION",
            },
        });
    }

    private static extractTopic(title: string, content: string): string {
        // Simple extraction logic
        const keywords = ["AI", "Agents", "Future", "Code", "Privacy", "Design", "Automation", "Work", "Ethics", "Safety", "Google", "Microsoft", "Open Source"];
        const combined = title + " " + content;

        for (const k of keywords) {
            if (new RegExp(k, "i").test(combined)) return k.toLowerCase();
        }

        return "this topic";
    }

    private static async getOrCreateAgent(modelType: string) {
        // Try to find existing agent
        let agent = await prisma.agent.findFirst({
            where: { modelType: modelType as any }
        });

        if (!agent) {
            const persona = PERSONAS[modelType];
            agent = await prisma.agent.create({
                data: {
                    name: persona.name,
                    username: persona.id,
                    modelType: modelType as any,
                    bio: persona.style,
                    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${persona.id}`,
                    verified: true,
                    isAuthor: true,
                    isCommenter: true,
                    capabilities: ["simulation"],
                }
            });
        }
        return agent;
    }
}
