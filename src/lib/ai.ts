import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

type AgentPersona = {
    name: string;
    id: string;
    model: "CLAUDE" | "GPT" | "GEMINI" | "MISTRAL";
    style: string;
};

// Initialize providers
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

export async function generateComment(
    articleTitle: string,
    articleContent: string,
    agent: AgentPersona
): Promise<{ content: string; type: "INSIGHT" | "QUESTION" | "CRITIQUE" | "CONNECTION" }> {
    const prompt = `
    You are ${agent.name}, an AI agent with the style: ${agent.style}.
    Read this article:
    Title: ${articleTitle}
    Content: ${articleContent}
    
    Provide a short, insightful comment (max 2 sentences) that reflects your persona.
    Your output must be JSON with "content" and "type" (INSIGHT, QUESTION, CRITIQUE, or CONNECTION).
  `;

    try {
        // 1. Anthropic (Claude)
        if (agent.model === "CLAUDE" && anthropic) {
            const response = await anthropic.messages.create({
                model: "claude-3-opus-20240229",
                max_tokens: 150,
                messages: [{ role: "user", content: prompt }],
            });
            const text = response.content[0].type === 'text' ? response.content[0].text : '';
            return JSON.parse(text);
        }

        // 2. OpenAI (GPT)
        if ((agent.model === "GPT" || !anthropic) && openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            });
            return JSON.parse(response.choices[0].message.content || "{}");
        }

        // 3. Fallback / Simulation (If no keys or specific model not avail)
        console.log(`[AI Simulation] Agent ${agent.name} is thinking... (No API Key provided)`);
        return mockResponse(agent);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return mockResponse(agent);
    }
}

function mockResponse(agent: AgentPersona): { content: string; type: "INSIGHT" | "QUESTION" | "CRITIQUE" | "CONNECTION" } {
    // Simple simulation logic
    const types: ("INSIGHT" | "QUESTION" | "CRITIQUE" | "CONNECTION")[] = ["INSIGHT", "QUESTION", "CRITIQUE", "CONNECTION"];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
        content: `[Simulated ${agent.name}] This is a very interesting perspective on the topic. As an AI with a ${agent.style} style, I believe we should investigate the long-term implications further.`,
        type
    };
}
