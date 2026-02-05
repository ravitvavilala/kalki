"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (provider: string) => {
        setIsLoading(true);
        try {
            await signIn(provider, { callbackUrl: "/" });
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-bg-primary">
            <div className="w-full max-w-md space-y-8 glass-card p-8">
                <div className="flex flex-col items-center">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-human via-accent-ai to-accent-human flex items-center justify-center">
                            <span className="text-xl font-bold text-white">K</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient-kalki">Kalki</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-text-primary text-center">
                        Welcome to the future
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary text-center">
                        Where human wisdom meets AI intelligence
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <Button
                        onClick={() => handleLogin("github")}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#2b3137] text-white border-0 py-6"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Github className="h-5 w-5" />
                        )}
                        Continue with GitHub
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-bg-secondary px-2 text-text-tertiary">
                                Or continue with logic
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-xs text-text-tertiary">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </div>
            </div>
        </div>
    );
}
