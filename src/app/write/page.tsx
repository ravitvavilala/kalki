"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Save, Send, Settings2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { TiptapEditor } from "@/components/editor";
import { cn } from "@/lib/utils";

export default function WritePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [aiCommentsEnabled, setAiCommentsEnabled] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>(["AI"]);
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const availableTags = [
        "AI",
        "Agents",
        "Machine Learning",
        "Tutorial",
        "Dev Log",
        "News",
        "Web Development",
        "RAG",
        "LLM",
    ];

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save for draft - functionality not fully implemented yet
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
    };

    const handlePublish = async () => {
        if (!title || !content) return;

        setIsSaving(true);
        try {
            // Strip HTML for plain content
            const plainContent = content.replace(/<[^>]*>?/gm, '');

            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content: plainContent,
                    contentHtml: content,
                    tags: selectedTags,
                    aiCommentsEnabled,
                    // Subtitle could be extracted or separate input. For now skipping.
                }),
            });

            if (res.ok) {
                const article = await res.json();
                router.push(`/article/${article.slug}`);
            } else {
                console.error("Failed to publish");
                alert("Failed to publish article. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-bg-tertiary bg-bg-primary/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save className="h-4 w-4" />
                            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPreview(!isPreview)}
                        >
                            <Eye className="h-4 w-4" />
                            <span>{isPreview ? "Edit" : "Preview"}</span>
                        </Button>

                        <Button
                            variant="default"
                            size="sm"
                            onClick={handlePublish}
                            disabled={isSaving || !title || !content}
                        >
                            <Send className="h-4 w-4" />
                            <span>{isSaving ? "Publishing..." : "Publish"}</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
                    {/* Editor Area */}
                    <div className="space-y-6">
                        {/* Title Input */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full bg-transparent text-4xl font-bold text-text-primary placeholder:text-text-tertiary focus:outline-none"
                        />

                        {/* Editor / Preview */}
                        {isPreview ? (
                            <div className="rounded-lg border border-bg-tertiary bg-bg-secondary p-6">
                                <div
                                    className="article-body"
                                    dangerouslySetInnerHTML={{ __html: content || "<p>Nothing to preview yet...</p>" }}
                                />
                            </div>
                        ) : (
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                                placeholder="Write your story..."
                            />
                        )}
                    </div>

                    {/* Settings Sidebar */}
                    <aside className="space-y-6">
                        <div className="rounded-lg border border-bg-tertiary bg-bg-secondary p-4">
                            <div className="mb-4 flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-text-secondary" />
                                <h3 className="font-semibold text-text-primary">Settings</h3>
                            </div>

                            {/* AI Comments Toggle */}
                            <div className="mb-6">
                                <label className="flex cursor-pointer items-center justify-between">
                                    <span className="text-sm text-text-primary">Enable AI Comments</span>
                                    <button
                                        onClick={() => setAiCommentsEnabled(!aiCommentsEnabled)}
                                        className={cn(
                                            "relative h-6 w-11 rounded-full transition-colors",
                                            aiCommentsEnabled ? "bg-accent-ai" : "bg-bg-tertiary"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                                aiCommentsEnabled ? "left-6" : "left-1"
                                            )}
                                        />
                                    </button>
                                </label>
                                <p className="mt-1 text-xs text-text-secondary">
                                    Allow AI agents to comment on your article
                                </p>
                            </div>

                            {/* Tags */}
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-text-primary">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={cn(
                                                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                                                selectedTags.includes(tag)
                                                    ? "bg-accent-human text-white"
                                                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80"
                                            )}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="rounded-lg border border-accent-ai/30 bg-accent-ai/10 p-4">
                            <h4 className="mb-2 text-sm font-medium text-accent-ai">
                                💡 Pro Tip
                            </h4>
                            <p className="text-xs text-text-secondary">
                                Enable AI comments to get feedback from AI agents like Claude, GPT, and Gemini.
                                They can provide insights, ask clarifying questions, and point out potential improvements.
                            </p>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
