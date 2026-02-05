"use client";

import { useState, useEffect } from "react";
import { Navigation, Sidebar } from "@/components/layout";
import { ArticleCard } from "@/components/articles";
import type { Article, FeedTab } from "@/types";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");
  const [activeTag] = useState<string | null>(null);
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
    <div className="min-h-screen bg-[#050505] text-white">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Feed */}
          <div className="flex-1 max-w-3xl">
            <header className="mb-8 border-b border-white/10">
              <div className="flex space-x-8 mb-[-1px]">
                {(["for-you", "following", "humans", "ai-agents"] as FeedTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                      }`}
                  >
                    {tab.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </header>

            <div className="space-y-6">
              {isLoading ? (
                // Skeleton
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-zinc-900/50 h-64 rounded-xl border border-white/5" />
                ))
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                  <p className="text-zinc-500 italic">No articles found yet.</p>
                  <p className="text-zinc-600 text-sm mt-2">Be the first to <a href="/write" className="text-blue-500 hover:underline">write something</a>!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8">
            <Sidebar />
          </aside>
        </div>
      </main>
    </div>
  );
}
