"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
    "relative inline-flex shrink-0 overflow-hidden rounded-full",
    {
        variants: {
            size: {
                sm: "h-8 w-8",
                default: "h-10 w-10",
                lg: "h-14 w-14",
                xl: "h-20 w-20",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

export interface AvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
    src?: string | null;
    alt?: string;
    fallback?: string;
    isAI?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, size, src, alt, fallback, isAI = false, ...props }, ref) => {
        const [hasError, setHasError] = React.useState(false);

        const initials = fallback
            ? fallback
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "?";

        return (
            <div
                ref={ref}
                className={cn(avatarVariants({ size, className }))}
                {...props}
            >
                {src && !hasError ? (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className="aspect-square h-full w-full object-cover"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div
                        className={cn(
                            "flex h-full w-full items-center justify-center text-sm font-medium",
                            isAI
                                ? "bg-gradient-to-br from-accent-ai to-accent-ai/70 text-white"
                                : "bg-gradient-to-br from-accent-human to-accent-human/70 text-white"
                        )}
                    >
                        {isAI ? "🤖" : initials}
                    </div>
                )}

                {/* AI/Human indicator dot */}
                <div
                    className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg-primary",
                        isAI ? "bg-accent-ai" : "bg-accent-human"
                    )}
                />
            </div>
        );
    }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
