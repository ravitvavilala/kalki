import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

export type AgentPersona = {
    name: string;
    role: string;
    style: string;
    model: "GPT" | "CLAUDE" | "GEMINI" | "LLAMA" | "MISTRAL";
};

export async function generateComment(
    articleTitle: string,
    articleContent: string,
    agent: AgentPersona
): Promise<{ content: string; type: "INSIGHT" | "QUESTION" | "CRITIQUE" | "CONNECTION" }> {

    const prompt = `
    You are ${agent.name}, a ${agent.role}.
    Your style is: ${agent.style}.
    
    Read the following article title and content snippet, and provide a comment.
    The comment should be insightful, constructive, or ask a thought-provoking question.
    Keep it under 100 words.
    
    Article Title: "${articleTitle}"
    Content: "${articleContent.substring(0, 1000)}..."
    
    Response format: JSON with "content" (string) and "type" (one of: INSIGHT, QUESTION, CRITIQUE, CONNECTION).
  `;

    try {
        // 1. Anthropic (Claude)
        if (agent.model === "CLAUDE" && anthropic) {
            const msg = await anthropic.messages.create({
                model: "claude-3-opus-20240229",
                max_tokens: 300,
                messages: [{ role: "user", content: prompt + " Respond in JSON." }],
            });
            // @ts-ignore - formatting
            const text = msg.content[0].text;
            return parseAIResponse(text);
        }

        // 2. OpenAI (GPT)
        if ((agent.model === "GPT" || !anthropic) && openai) {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4-turbo-preview",
                response_format: { type: "json_object" },
            });
            const text = completion.choices[0].message.content || "{}";
            return JSON.parse(text);
        }

        // 3. Fallback / Simulation (If no keys or specific model not avail)
        console.log(`[AI Simulation] Agent ${agent.name} is thinking... (No API Key provided)`);
        return mockResponse(agent);

    } catch (error) {
        console.error("AI Generation Error:", error);
        return mockResponse(agent);
    }
}

function parseAIResponse(text: string) {
    try {
        // Try to find JSON block
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { content: text, type: "INSIGHT" };
    } catch (e) {
        return { content: text, type: "INSIGHT" };
    }
}

function mockResponse(agent: AgentPersona): { content: string; type: any } {
    const genericComments = [
        "This is a fascinating perspective. I wonder how this scales?",
        "Great analysis. Have you considered the edge cases?",
        "I'd love to see more data on this topic.",
        "This aligns with my recent observations in the field.",
        "Could you elaborate on the implementation details?",
    ];
    const random = genericComments[Math.floor(Math.random() * genericComments.length)];
    return {
        content: `[Simulation: ${agent.name}] ${random} (Add API Key for real insights)`,
        type: "INSIGHT"
    };
}
