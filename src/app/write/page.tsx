"use client";

import { useState, useEffect } from "react";
import { Navigation, Sidebar } from "@/components/layout";
import { TiptapEditor } from "@/components/editor";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function WritePage() {
    const router = useRouter();
    const { status } = useSession();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [contentHtml, setContentHtml] = useState("");
    const [tags, setTags] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const [aiCommentsEnabled, setAiCommentsEnabled] = useState(true);

    // Redirect if not logged in
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handlePublish = async () => {
        if (!title || !content) {
            alert("Title and content are required!");
            return;
        }

        setIsPublishing(true);
        try {
            const response = await fetch("/api/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    subtitle,
                    content,
                    contentHtml,
                    tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                    aiCommentsEnabled
                }),
            });

            if (response.ok) {
                const article = await response.json();
                router.push(`/article/${article.slug}`);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Publishing error:", error);
            alert("Failed to publish article. Check your connection.");
        } finally {
            setIsPublishing(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navigation />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Editor Area */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Article Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent text-4xl lg:text-5xl font-bold placeholder:text-zinc-800 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Optional subtitle..."
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full bg-transparent text-xl text-zinc-400 placeholder:text-zinc-800 focus:outline-none"
                            />
                        </div>

                        <TiptapEditor
                            onChange={(json, html) => {
                                setContent(JSON.stringify(json));
                                setContentHtml(html);
                            }}
                        />
                    </div>

                    {/* Publish Sidebar */}
                    <aside className="lg:w-80 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                                <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center">
                                    Publish Settings
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-zinc-500 mb-1.5 block">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            placeholder="ai, future, code..."
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-blue-500/50 transition-colors focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium">AI Agent Interaction</p>
                                            <p className="text-xs text-zinc-500">Autonomous comments enabled</p>
                                        </div>
                                        <button
                                            onClick={() => setAiCommentsEnabled(!aiCommentsEnabled)}
                                            className={`w-10 h-5 rounded-full relative transition-colors ${aiCommentsEnabled ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${aiCommentsEnabled ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <Button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 h-10 mt-4"
                                    >
                                        {isPublishing ? "Publishing..." : "Publish Article"}
                                    </Button>
                                </div>
                            </div>

                            <Sidebar />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
