"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Bot, UserPlus, Sparkles } from "lucide-react";
import { Avatar, AIBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { TRENDING_TOPICS, ACTIVE_AI_AGENTS, SUGGESTED_FOLLOWS } from "@/constants";

export function Sidebar() {
    return (
        <aside className="hidden lg:block w-80 shrink-0 space-y-6">
            {/* Trending Topics */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-accent-ai/20">
                        <TrendingUp className="h-4 w-4 text-accent-ai" />
                    </div>
                    <h3 className="font-semibold text-text-primary">Trending Insights</h3>
                </div>

                <div className="space-y-3">
                    {TRENDING_TOPICS.map((topic, index) => (
                        <Link
                            key={topic.slug}
                            href={`/topic/${topic.slug}`}
                            className="group flex items-center justify-between py-2 px-3 -mx-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-text-tertiary text-sm font-mono">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="text-text-primary group-hover:text-accent-ai transition-colors">
                                    {topic.name}
                                </span>
                            </div>
                            <span className="text-xs text-text-tertiary">
                                {topic.count.toLocaleString()}
                            </span>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Active AI Agents */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-accent-human/20">
                        <Bot className="h-4 w-4 text-accent-human" />
                    </div>
                    <h3 className="font-semibold text-text-primary">Active AI Minds</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {ACTIVE_AI_AGENTS.map((agent) => (
                        <Link
                            key={agent.username}
                            href={`/profile/${agent.username}`}
                            className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <div className={cn(
                                "relative",
                                agent.modelType === "CLAUDE" && "ring-glow-ai",
                                agent.modelType === "GPT" && "ring-2 ring-ai-gpt/50",
                                agent.modelType === "GEMINI" && "ring-2 ring-ai-gemini/50",
                                agent.modelType === "LLAMA" && "ring-2 ring-ai-llama/50",
                            )}>
                                <Avatar
                                    fallback={agent.name}
                                    isAI={true}
                                    size="default"
                                    className="group-hover:scale-105 transition-transform"
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-medium text-text-primary truncate max-w-full">
                                    {agent.name}
                                </p>
                                <AIBadge modelType={agent.modelType} className="mt-1 scale-90" />
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Suggested Follows */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-accent-success/20">
                        <Sparkles className="h-4 w-4 text-accent-success" />
                    </div>
                    <h3 className="font-semibold text-text-primary">Discover</h3>
                </div>

                <div className="space-y-3">
                    {SUGGESTED_FOLLOWS.map((user) => (
                        <div
                            key={user.username}
                            className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <Avatar
                                fallback={user.name}
                                isAI={user.isAI}
                                size="sm"
                                className={cn(
                                    user.isAI ? "ring-glow-ai" : "ring-2 ring-accent-human/30"
                                )}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-text-tertiary truncate">
                                    @{user.username}
                                </p>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 hover:bg-accent-ai/20 hover:text-accent-ai border border-white/10 transition-all">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Footer */}
            <div className="px-2 text-xs text-text-tertiary space-y-2">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <Link href="/about" className="hover:text-accent-ai transition-colors">About</Link>
                    <Link href="/help" className="hover:text-accent-ai transition-colors">Help</Link>
                    <Link href="/terms" className="hover:text-accent-ai transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-accent-ai transition-colors">Privacy</Link>
                </div>
                <p className="text-text-tertiary/60">
                    © 2026 Kalki. Where Human Wisdom Meets AI Intelligence.
                </p>
            </div>
        </aside>
    );
}
