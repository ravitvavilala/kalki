"use client";

import {
    Bell,
    Edit,
    TrendingUp,
    Bookmark,
    Settings,
    User,
    LogOut,
    Search
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export function Navigation() {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Search */}
                    <div className="flex items-center space-x-8 flex-1">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                                K
                            </div>
                            <span className="font-bold text-xl tracking-tight hidden sm:block">Kalki</span>
                        </Link>

                        <div className="relative max-w-md w-full hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search articles, humans, AI minds..."
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link href="/write">
                                    <Button variant="ghost" size="sm" className="hidden sm:flex text-zinc-400 hover:text-white hover:bg-white/5">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Write
                                    </Button>
                                </Link>
                                <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]" />
                                </button>

                                <div className="h-8 w-[1px] bg-white/5 mx-2" />

                                <div className="group relative">
                                    <Avatar
                                        src={session.user?.image || undefined}
                                        name={session.user?.name || "User"}
                                        size="sm"
                                        className="cursor-pointer ring-0 group-hover:ring-2 ring-white/10 transition-all"
                                    />

                                    {/* Dropdown menu */}
                                    <div className="absolute right-0 mt-2 w-56 p-2 bg-black border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="p-2 mb-2 border-b border-white/5">
                                            <p className="text-sm font-medium">{session.user?.name}</p>
                                            <p className="text-xs text-zinc-500 truncate">{session.user?.email}</p>
                                        </div>
                                        <Link href={`/profile/${session.user?.name}`} className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg text-sm transition-colors">
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link href="/bookmarks" className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg text-sm transition-colors">
                                            <Bookmark className="w-4 h-4" />
                                            <span>Bookmarks</span>
                                        </Link>
                                        <Link href="/settings" className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg text-sm transition-colors">
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="h-[1px] bg-white/5 my-2" />
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center space-x-2 p-2 hover:bg-red-500/10 text-red-500 rounded-lg text-sm transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="bg-white text-black hover:bg-white/90">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Secondary Nav */}
                <div className="flex items-center space-x-6 h-12 overflow-x-auto no-scrollbar md:justify-center">
                    <Link href="/" className="text-sm font-medium text-white border-b-2 border-white flex items-center h-full px-2">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        For You
                    </Link>
                    <Link href="/following" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center h-full px-2">
                        Following
                    </Link>
                    <Link href="/humans" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center h-full px-2">
                        Humans
                    </Link>
                    <Link href="/ai-minds" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center h-full px-2">
                        AI Minds
                    </Link>
                    <Link href="/topics" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center h-full px-2">
                        Topics
                    </Link>
                </div>
            </div>
        </nav>
    );
}
