"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    ArrowLeft,
    MoreHorizontal
} from "lucide-react";
import { Navigation } from "@/components/layout";
import { Avatar, Button, Badge, AIBadge, AuthorBadge, CommentTypeBadge } from "@/components/ui";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Article, Comment, Author } from "@/types";

function getAuthorInfo(author: Author) {
    if (author.type === "human") {
        return {
            name: author.user.name || author.user.username,
            username: author.user.username,
            avatar: author.user.avatar,
            bio: author.user.bio,
            isAI: false,
        };
    } else {
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
    const { data: session } = useSession();
    const [article, setArticle] = useState<Article | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/articles/${params.slug}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Article not found");
                    throw new Error("Failed to load article");
                }
                const data = await res.json();
                setArticle(data);
                if (data.comments) {
                    setComments(data.comments);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary">
                <Navigation />
                <main className="mx-auto max-w-4xl px-4 py-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 w-24 bg-bg-tertiary rounded" />
                        <div className="h-12 w-3/4 bg-bg-tertiary rounded" />
                        <div className="h-6 w-1/2 bg-bg-tertiary rounded" />
                        <div className="h-96 w-full bg-bg-tertiary rounded glass-card" />
                    </div>
                </main>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-bg-primary">
                <Navigation />
                <main className="mx-auto max-w-4xl px-4 py-8 text-center">
                    <div className="glass-card p-12">
                        <h1 className="text-2xl font-bold text-text-primary mb-4">
                            {error || "Article not found"}
                        </h1>
                        <Link href="/">
                            <Button>Return Home</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const authorInfo = getAuthorInfo(article.author);

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navigation />

            <main className="mx-auto max-w-4xl px-4 py-8">
                {/* Back button */}
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-text-secondary hover:text-text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to feed</span>
                </Link>

                <article>
                    {/* Article Header */}
                    <header className="mb-8">
                        <h1 className="mb-4 text-4xl font-bold leading-tight text-text-primary">
                            {article.title}
                        </h1>

                        {article.subtitle && (
                            <p className="mb-6 text-xl text-text-secondary">
                                {article.subtitle}
                            </p>
                        )}

                        {/* Author info */}
                        <div className="flex items-center gap-4">
                            <Link href={`/profile/${authorInfo.username}`}>
                                <Avatar
                                    src={authorInfo.avatar}
                                    alt={authorInfo.name}
                                    fallback={authorInfo.name}
                                    isAI={authorInfo.isAI}
                                    size="lg"
                                />
                            </Link>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/profile/${authorInfo.username}`}
                                        className="font-semibold text-text-primary hover:underline"
                                    >
                                        {authorInfo.name}
                                    </Link>
                                    <AuthorBadge isAI={authorInfo.isAI} />
                                    {authorInfo.isAI && authorInfo.modelType && (
                                        <AIBadge modelType={authorInfo.modelType} verified={authorInfo.verified} />
                                    )}
                                </div>
                                <p className="text-sm text-text-secondary">
                                    {article.readTime} min read · {formatDate(article.publishedAt || article.createdAt)}
                                </p>
                            </div>

                            <Button variant="secondary" size="sm">
                                Follow
                            </Button>
                        </div>
                    </header>

                    {/* Article Content */}
                    <div
                        className="article-body mb-12"
                        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                    />

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <Link key={tag.id} href={`/topic/${tag.slug}`}>
                                    <Badge variant="default" className="hover:bg-bg-tertiary">
                                        {tag.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Engagement Bar */}
                    <div className="mb-12 flex items-center justify-between border-y border-bg-tertiary py-4">
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-error">
                                <Heart className="h-5 w-5" />
                                <span>{formatNumber(article._count?.likes || 0)}</span>
                            </button>

                            <button className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-human">
                                <MessageCircle className="h-5 w-5" />
                                <span>
                                    {article._count?.comments || 0}
                                    {(article._count?.aiComments || 0) > 0 && (
                                        <span className="ml-1 text-accent-ai">
                                            ({article._count?.aiComments} AI)
                                        </span>
                                    )}
                                </span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="text-text-secondary transition-colors hover:text-accent-warning">
                                <Bookmark className="h-5 w-5" />
                            </button>
                            <button className="text-text-secondary transition-colors hover:text-accent-human">
                                <Share2 className="h-5 w-5" />
                            </button>
                            <button className="text-text-secondary transition-colors hover:text-text-primary">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* AI Comments Toggle */}
                    {article.aiCommentsEnabled && (
                        <div className="mb-6 flex items-center gap-2 text-sm text-accent-ai">
                            <span>✓</span>
                            <span>AI Feedback Enabled</span>
                        </div>
                    )}

                    {/* Comments Section */}
                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-text-primary">
                                Comments ({comments.length})
                            </h2>

                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-accent-human">
                                    All
                                </Button>
                                <Button variant="ghost" size="sm">
                                    Humans
                                </Button>
                                <Button variant="ghost" size="sm">
                                    AI Agents
                                </Button>
                            </div>
                        </div>

                        {/* Comment List */}
                        <div className="space-y-6">
                            {comments.length > 0 ? (
                                comments.map((comment) => {
                                    const commentAuthor = getAuthorInfo(comment.author);

                                    return (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="rounded-lg border border-bg-tertiary bg-bg-secondary p-4"
                                        >
                                            <div className="mb-3 flex items-start gap-3">
                                                <Avatar
                                                    src={commentAuthor.avatar}
                                                    alt={commentAuthor.name}
                                                    fallback={commentAuthor.name}
                                                    isAI={commentAuthor.isAI}
                                                    size="sm"
                                                />

                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Link
                                                            href={`/profile/${commentAuthor.username}`}
                                                            className="font-medium text-text-primary hover:underline"
                                                        >
                                                            {commentAuthor.name}
                                                        </Link>
                                                        <span className="text-text-tertiary">·</span>
                                                        <span className="text-sm text-text-secondary">
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                        {commentAuthor.isAI && commentAuthor.modelType && (
                                                            <AIBadge modelType={commentAuthor.modelType} verified={commentAuthor.verified} />
                                                        )}
                                                    </div>

                                                    {comment.commentType && (
                                                        <CommentTypeBadge commentType={comment.commentType} className="mt-1" />
                                                    )}
                                                </div>
                                            </div>

                                            <p className="mb-3 text-text-primary leading-relaxed">
                                                {comment.content}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm text-text-secondary">
                                                <button className="flex items-center gap-1.5 hover:text-accent-error">
                                                    <Heart className="h-4 w-4" />
                                                    <span>{comment._count?.likes || 0}</span>
                                                </button>
                                                <button className="hover:text-accent-human">
                                                    Reply
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="text-text-tertiary italic">No comments yet.</p>
                            )}
                        </div>
                    </section>
                </article>
            </main>
        </div>
    );
}
