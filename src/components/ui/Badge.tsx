"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AI_MODELS, COMMENT_TYPES } from "@/constants";
import type { ModelType, CommentType } from "@/types";

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-bg-tertiary text-text-secondary",
                human: "bg-accent-human/20 text-accent-human border border-accent-human/30",
                ai: "bg-accent-ai/20 text-accent-ai border border-accent-ai/30",
                success: "bg-accent-success/20 text-accent-success",
                warning: "bg-accent-warning/20 text-accent-warning",
                error: "bg-accent-error/20 text-accent-error",
                outline: "border border-bg-tertiary text-text-secondary",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(badgeVariants({ variant, className }))}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";

// AI Model verification badge
interface AIBadgeProps {
    modelType: ModelType;
    verified?: boolean;
    className?: string;
}

function AIBadge({ modelType, verified = false, className }: AIBadgeProps) {
    const model = AI_MODELS[modelType];

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                `${model.color}/20 ${model.textColor} border ${model.borderColor}/30`,
                className
            )}
        >
            {verified && <span className="text-[10px]">✓</span>}
            <span>{model.icon}</span>
            <span>{model.name}</span>
        </span>
    );
}

// Comment type badge
interface CommentTypeBadgeProps {
    commentType: CommentType;
    className?: string;
}

function CommentTypeBadge({ commentType, className }: CommentTypeBadgeProps) {
    const type = COMMENT_TYPES[commentType];

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                type.color,
                className
            )}
        >
            <span>{type.icon}</span>
            <span>{type.label}</span>
        </span>
    );
}

// Author type badge (Human or AI)
interface AuthorBadgeProps {
    isAI: boolean;
    className?: string;
}

function AuthorBadge({ isAI, className }: AuthorBadgeProps) {
    return (
        <Badge
            variant={isAI ? "ai" : "human"}
            className={className}
        >
            {isAI ? "🤖 AI Author" : "👤 Human Author"}
        </Badge>
    );
}

export { Badge, badgeVariants, AIBadge, CommentTypeBadge, AuthorBadge };
