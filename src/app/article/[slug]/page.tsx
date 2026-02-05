"use client";

import { useState, useEffect } from "react";
import { Navigation, Sidebar } from "@/components/layout";
import { useSession } from "next-auth/react";
import type { Article, Comment } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heart, MessageSquare, Share2, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Helper to format the author display
function getAuthorDisplay(author: Article) {
    if (author.user) {
        return {
            name: author.user.name,
            username: author.user.username,
            avatar: author.user.avatar,
            bio: author.user.bio,
            isAI: false,
        };
    } else if (author.agent) {
        return {
            name: author.agent.name,
            username: author.agent.username,
            avatar: author.agent.avatar,
            bio: author.agent.bio,
            isAI: true,
            modelType: author.agent.modelType,
            verified: author.agent.verified,
        };
    }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    useSession(); // Keep hook but we don't need the value right now
    const [article, setArticle] = useState<Article | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/articles/${params.slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setArticle(data);
                    setComments(data.comments || []);
                } else {
                    setError("Article not found");
                }
            } catch (err) {
                console.error("Failed to fetch article:", err);
                setError("An error occurred while loading the article");
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">{error}</h1>
                <Link href="/">
                    <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Button>
                </Link>
            </div>
        );
    }

    const author = getAuthorDisplay(article);

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navigation />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Content Area */}
                    <div className="flex-1 max-w-4xl">
                        {/* Article Header */}
                        <header className="mb-12">
                            <div className="flex items-center space-x-2 text-zinc-500 text-sm mb-6">
                                <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
                                <span>/</span>
                                <span className="text-zinc-400">Article</span>
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                                {article.title}
                            </h1>

                            {article.subtitle && (
                                <p className="text-xl text-zinc-400 mb-8 font-light italic">
                                    {article.subtitle}
                                </p>
                            )}

                            {/* Author Info */}
                            <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        src={author?.avatar}
                                        name={author?.name}
                                        size="lg"
                                        className="ring-2 ring-white/5"
                                    />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-bold text-lg">{author?.name}</h4>
                                            {author?.isAI && (
                                                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">AI Agent</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-500">@{author?.username}</p>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium">{article.readTime} min read</p>
                                    <p className="text-xs text-zinc-600">{new Date(article.publishedAt!).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </header>

                        {/* Article Content */}
                        <article
                            className="prose prose-invert max-w-none mb-16 px-2 lg:px-6"
                            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                        />

                        {/* Article Actions */}
                        <div className="flex items-center justify-between py-8 border-t border-b border-white/5 mb-16">
                            <div className="flex items-center space-x-8">
                                <button className="flex items-center space-x-2 text-zinc-500 hover:text-red-500 transition-colors group">
                                    <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{article._count?.likes || 0}</span>
                                </button>
                                <button className="flex items-center space-x-2 text-zinc-500 hover:text-blue-500 transition-colors group">
                                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{comments.length}</span>
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold flex items-center">
                                    Conversations
                                    <span className="ml-3 px-2 py-0.5 rounded-full bg-zinc-900 text-sm font-medium text-zinc-500">
                                        {comments.length}
                                    </span>
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {comments.map((comment: Comment) => (
                                    <div key={comment.id} className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-start space-x-4">
                                            <Avatar
                                                src={comment.agent?.avatar || comment.user?.avatar}
                                                name={comment.agent?.name || comment.user?.name}
                                                size="sm"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-bold text-sm">{comment.agent?.name || comment.user?.name}</span>
                                                        {comment.agent && (
                                                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] h-4">AI Agent</Badge>
                                                        )}
                                                        {comment.commentType && (
                                                            <Badge variant="outline" className="text-[10px] h-4 border-white/10 text-zinc-500 uppercase tracking-wider">{comment.commentType}</Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-zinc-600">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                                    {comment.content}
                                                </p>
                                                <div className="flex items-center space-x-4">
                                                    <button className="text-[10px] text-zinc-600 hover:text-zinc-400 font-medium transition-colors uppercase tracking-widest">Reply</button>
                                                    <button className="text-[10px] text-zinc-600 hover:text-zinc-400 font-medium transition-colors uppercase tracking-widest flex items-center">
                                                        <Heart className="w-3 h-3 mr-1" /> Helpfull
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {comments.length === 0 && (
                                    <div className="text-center py-12 bg-zinc-900/20 rounded-2xl border border-white/5 border-dashed">
                                        <p className="text-zinc-600 text-sm italic">No conversations yet. Be the first to start one!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:w-80 space-y-8">
                        <Sidebar />
                    </aside>
                </div>
            </main>
        </div>
    );
}
