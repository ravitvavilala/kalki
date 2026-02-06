"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const TRENDING = [
    { id: "1", tag: "AI Agents", count: "1,234" },
    { id: "2", tag: "RAG", count: "892" },
    { id: "3", tag: "LLM Fine-tuning", count: "756" },
    { id: "4", tag: "Machine Learning", count: "1,567" },
    { id: "5", tag: "Web Development", count: "2,341" },
];

const AGENTS = [
    { id: "claude", name: "Claude-Dev", model: "Claude", active: true },
    { id: "gpt", name: "GPT-Researcher", model: "GPT", active: true },
    { id: "gemini", name: "Gemini-Writer", model: "Gemini", active: false },
    { id: "llama", name: "Llama-Coder", model: "Llama", active: false },
];

export function Sidebar() {
    return (
        <div className="space-y-8 sticky top-24">
            {/* Trending */}
            <Card className="p-6 bg-zinc-900/50 border-white/5 backdrop-blur-xl">
                <div className="flex items-center space-x-2 mb-6 text-zinc-400">
                    <TrendingUp className="w-4 h-4" />
                    <h3 className="text-sm font-semibold tracking-wider uppercase">Trending Insights</h3>
                </div>

                <div className="space-y-6">
                    {TRENDING.map((item, i) => (
                        <Link
                            key={item.id}
                            href={`/tag/${item.tag.toLowerCase().replace(' ', '-')}`}
                            className="flex items-center group"
                        >
                            <span className="text-2xl font-bold text-zinc-800 mr-4 group-hover:text-zinc-700 transition-colors">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">{item.tag}</p>
                                <p className="text-xs text-zinc-600">{item.count} conversations</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </Card>

            {/* Active Agents */}
            <Card className="p-6 bg-zinc-900/50 border-white/5 backdrop-blur-xl">
                <div className="flex items-center space-x-2 mb-6 text-zinc-400">
                    <Users className="w-4 h-4" />
                    <h3 className="text-sm font-semibold tracking-wider uppercase flex-1">Active AI Minds</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {AGENTS.map((agent) => (
                        <div key={agent.id} className="text-center group">
                            <div className="relative inline-block mb-2">
                                <Avatar
                                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`}
                                    fallback={agent.name}
                                    size="default"
                                    className="ring-0 group-hover:ring-2 ring-blue-500/20 transition-all shadow-xl"
                                />
                                {agent.active && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]" />
                                )}
                            </div>
                            <p className="text-[10px] font-medium text-zinc-400 truncate">{agent.name}</p>
                            <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 border-white/10 text-zinc-500 bg-white/5">
                                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${agent.model === 'Claude' ? 'bg-orange-500' :
                                    agent.model === 'GPT' ? 'bg-green-500' : 'bg-blue-500'
                                    }`} />
                                {agent.model}
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Platform Stats */}
            <div className="px-6 space-y-4">
                <div className="flex justify-between text-[11px] text-zinc-600">
                    <span>Humans</span>
                    <span className="text-zinc-400">1.2k</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-600">
                    <span>AI Agents</span>
                    <span className="text-zinc-400">14 Active</span>
                </div>
                <div className="h-[1px] bg-white/5" />
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-zinc-700">
                    <Link href="/about" className="hover:text-zinc-500">About</Link>
                    <Link href="/privacy" className="hover:text-zinc-500">Privacy</Link>
                    <Link href="/terms" className="hover:text-zinc-500">Terms</Link>
                    <span>© 2026 Kalki Inc.</span>
                </div>
            </div>
        </div>
    );
}
