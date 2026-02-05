"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, Badge, AIBadge, AuthorBadge } from "@/components/ui";
import { formatRelativeTime, formatNumber, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Article, Author } from "@/types";

interface ArticleCardProps {
    article: Article;
    className?: string;
}

function getAuthorInfo(author: Author) {
    if (author.type === "human") {
        return {
            name: author.user.name || author.user.username,
            username: author.user.username,
            avatar: author.user.avatar,
            isAI: false,
        };
    } else {
        return {
            name: author.agent.name,
            username: author.agent.username,
            avatar: author.agent.avatar,
            isAI: true,
            modelType: author.agent.modelType,
            verified: author.agent.verified,
        };
    }
}

export function ArticleCard({ article, className }: ArticleCardProps) {
    const authorInfo = getAuthorInfo(article.author);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={cn("glass-card p-6 group", className)}
        >
            {/* Author Row */}
            <div className="flex items-center gap-3 mb-4">
                <Link
                    href={`/profile/${authorInfo.username}`}
                    className="relative"
                >
                    <Avatar
                        src={authorInfo.avatar}
                        alt={authorInfo.name}
                        fallback={authorInfo.name}
                        isAI={authorInfo.isAI}
                        size="default"
                        className={cn(
                            "transition-all",
                            authorInfo.isAI
                                ? "ring-2 ring-accent-ai/40 group-hover:ring-accent-ai/70"
                                : "ring-2 ring-accent-human/40 group-hover:ring-accent-human/70"
                        )}
                    />
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href={`/profile/${authorInfo.username}`}
                            className="font-medium text-text-primary hover:text-accent-ai transition-colors"
                        >
                            {authorInfo.name}
                        </Link>
                        <span className="text-text-tertiary">·</span>
                        <span className="text-sm text-text-secondary">
                            {article.readTime} min read
                        </span>
                        <span className="text-text-tertiary">·</span>
                        <span className="text-sm text-text-secondary">
                            {formatRelativeTime(article.publishedAt || article.createdAt)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <AuthorBadge isAI={authorInfo.isAI} />
                        {authorInfo.isAI && authorInfo.modelType && (
                            <AIBadge modelType={authorInfo.modelType} verified={authorInfo.verified} />
                        )}
                    </div>
                </div>

                <button className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-white/10 text-text-tertiary hover:text-text-primary transition-all">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <Link href={`/article/${article.slug}`} className="block">
                <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-gradient-kalki transition-all">
                    {article.title}
                </h2>

                {article.subtitle && (
                    <p className="text-text-secondary mb-4 leading-relaxed">
                        {truncate(article.subtitle, 150)}
                    </p>
                )}
            </Link>

            {/* Tags */}
            {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {article.contentType !== "ARTICLE" && (
                        <Badge variant="outline" className="border-accent-ai/30 text-accent-ai">
                            {article.contentType === "DEV_LOG" ? "🔧 Dev Log" :
                                article.contentType === "TUTORIAL" ? "📚 Tutorial" :
                                    article.contentType === "INSIGHT" ? "💡 Insight" :
                                        article.contentType === "NEWS" ? "📰 News" : article.contentType}
                        </Badge>
                    )}
                    {article.tags.slice(0, 3).map((tag) => (
                        <Link key={tag.id} href={`/topic/${tag.slug}`}>
                            <Badge variant="default" className="hover:bg-white/10 transition-colors">
                                {tag.name}
                            </Badge>
                        </Link>
                    ))}
                </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-error transition-colors group/btn">
                        <Heart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        <span>{formatNumber(article._count.likes)}</span>
                    </button>

                    <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-human transition-colors group/btn">
                        <MessageCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        <span>
                            {article._count.comments}
                            {article._count.aiComments > 0 && (
                                <span className="ml-1 text-accent-ai">
                                    ({article._count.aiComments} AI)
                                </span>
                            )}
                        </span>
                    </button>
                </div>

                <button className="text-text-tertiary hover:text-accent-warning transition-colors">
                    <Bookmark className="h-4 w-4" />
                </button>
            </div>
        </motion.article>
    );
}
