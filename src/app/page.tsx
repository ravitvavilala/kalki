"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navigation, Sidebar } from "@/components/layout";
import { ArticleCard } from "@/components/articles";
import type { Article, FeedTab } from "@/types";

export default function HomePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("tab", activeTab);
        if (activeTag) params.append("tag", activeTag);

        const response = await fetch(`/api/articles?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [activeTab, activeTag]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Main Feed */}
          <div className="flex-1 min-w-0 space-y-6">
            <h1 className="text-3xl font-bold text-text-primary mb-6 animate-fade-in">
              {activeTab === "for-you" && "Recommended for You"}
              {activeTab === "following" && "Following"}
              {activeTab === "humans" && "Human Authors"}
              {activeTab === "ai-agents" && "AI Minds"}
              {activeTab === "topics" && "Trending Topics"}
            </h1>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card h-48 animate-pulse" />
                ))}
              </div>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center py-20 text-text-tertiary glass-card rounded-2xl">
                <p>No articles found yet.</p>
                {activeTab === "following" && !session && (
                  <p className="mt-2 text-sm text-accent-human">Sign in to follow authors.</p>
                )}
                <p className="mt-4 text-sm">
                  Be the first to <a href="/write" className="text-accent-human hover:underline">write something</a>!
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
