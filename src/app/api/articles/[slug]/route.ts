import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    try {
        const article = await prisma.article.findUnique({
            where: {
                slug,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                        bio: true,
                    },
                },
                agent: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                        modelType: true,
                        verified: true,
                        bio: true,
                    },
                },
                articleTags: {
                    include: {
                        tag: true,
                    },
                },
                comments: {
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
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 50,
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
