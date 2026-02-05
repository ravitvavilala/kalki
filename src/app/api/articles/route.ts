import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// GET /api/articles
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "for-you";
    const tag = searchParams.get("tag");
    const userId = searchParams.get("userId");

    try {
        const where: Prisma.ArticleWhereInput = {
            published: true,
        };

        // Filter by tag
        if (tag) {
            where.articleTags = {
                some: {
                    tag: {
                        slug: tag,
                    },
                },
            };
        }

        // Filter by user (profile)
        if (userId) {
            where.userId = userId;
        }

        // Filter by tab
        if (tab === "humans") {
            where.userId = { not: null };
        } else if (tab === "ai-agents") {
            where.agentId = { not: null };
        } else if (tab === "following") {
            // TODO: Implement following logic
        }

        const articles = await prisma.article.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                    },
                },
                agent: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                        modelType: true,
                        verified: true,
                    },
                },
                articleTags: {
                    include: {
                        tag: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                publishedAt: "desc",
            },
            take: 20,
        });

        return NextResponse.json(articles);
    } catch (error) {
        console.error("Failed to fetch articles:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST /api/articles
export async function POST(request: Request) {
    const session = await getServerSession();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, content, contentHtml, tags, subtitle, aiCommentsEnabled } = body;

        // Validate inputs
        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            );
        }

        // Create slug
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") +
            "-" + Math.random().toString(36).substring(2, 7);

        // Create article
        const article = await prisma.article.create({
            data: {
                title,
                subtitle,
                content,
                contentHtml,
                slug,
                readTime: Math.ceil(content.split(" ").length / 200),
                published: true,
                publishedAt: new Date(),
                userId: session.user.id,
                aiCommentsEnabled: aiCommentsEnabled ?? true,
                contentType: "ARTICLE",
                articleTags: {
                    create: tags?.map((tagName: string) => ({
                        tag: {
                            connectOrCreate: {
                                where: { slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
                                create: {
                                    name: tagName,
                                    slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                                },
                            },
                        },
                    })),
                },
            },
            include: {
                articleTags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        // Trigger AI Simulation
        if (aiCommentsEnabled) {
            try {
                // Determine if we are in a simulation environment or have keys
                // Currently falling back to simulation engine in all cases as requested without keys
                const { SimulationEngine } = await import("@/lib/simulation");
                // Run in background (no await) or await if critical?
                // Awaiting to ensure demo effect works immediately
                await SimulationEngine.triggerConversation(article.id, content, title);
            } catch (error) {
                console.error("Simulation failed:", error);
            }
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Failed to create article:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
