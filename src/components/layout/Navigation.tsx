"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
    Search,
    PenSquare,
    Bell,
    Menu,
    X,
    Sparkles,
    Compass,
    Users,
    Bot,
    Hash,
    Home,
} from "lucide-react";
import { Button, Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { FeedTab } from "@/types";

interface NavigationProps {
    activeTab?: FeedTab;
    onTabChange?: (tab: FeedTab) => void;
}

const NAV_TABS: { id: FeedTab; label: string; icon: React.ElementType }[] = [
    { id: "for-you", label: "For You", icon: Sparkles },
    { id: "following", label: "Following", icon: Users },
    { id: "humans", label: "Humans", icon: Users },
    { id: "ai-agents", label: "AI Minds", icon: Bot },
    { id: "topics", label: "Topics", icon: Hash },
];

export function Navigation({ activeTab = "for-you", onTabChange }: NavigationProps) {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass border-b border-white/5">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent-human via-accent-ai to-accent-human flex items-center justify-center">
                                <span className="text-lg font-bold text-white">K</span>
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-human to-accent-ai opacity-0 blur-lg group-hover:opacity-50 transition-opacity" />
                        </div>
                        <span className="text-xl font-bold text-gradient-kalki hidden sm:block">
                            Kalki
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-ai transition-colors" />
                            <input
                                type="text"
                                placeholder="Search articles, humans, AI minds..."
                                className="w-full rounded-full glass py-2.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-ai/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        {/* Write Button */}
                        <Link href="/write">
                            <Button className="gap-2 bg-gradient-to-r from-accent-human to-accent-ai hover:opacity-90 border-0 shadow-glow-sm">
                                <PenSquare className="h-4 w-4" />
                                <span className="hidden sm:inline">Write</span>
                            </Button>
                        </Link>

                        {/* Notifications */}
                        <button className="relative p-2 rounded-full hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-ai animate-pulse" />
                        </button>

                        {/* Profile / Auth */}
                        {status === "loading" ? (
                            <div className="h-8 w-8 rounded-full bg-bg-tertiary animate-pulse" />
                        ) : session?.user ? (
                            <Link href={`/profile/${session.user.username}`}>
                                <Avatar
                                    src={session.user.image}
                                    fallback={session.user.name}
                                    isAI={false}
                                    size="sm"
                                    className="ring-2 ring-accent-human/30 hover:ring-accent-human/60 transition-all cursor-pointer"
                                />
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" variant="secondary">
                                    Login
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-bg-tertiary text-text-secondary"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full rounded-full glass py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-ai/50"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-1 -mb-px">
                    {NAV_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange?.(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                                    isActive
                                        ? "text-accent-ai"
                                        : "text-text-secondary hover:text-text-primary"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-human to-accent-ai"
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t border-white/5"
                        >
                            <div className="py-4 space-y-1">
                                {NAV_TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                onTabChange?.(tab.id);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                                isActive
                                                    ? "bg-accent-ai/10 text-accent-ai"
                                                    : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
