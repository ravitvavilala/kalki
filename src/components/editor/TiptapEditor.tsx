"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Quote,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    List,
    ListOrdered,
    Minus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface TiptapEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function TiptapEditor({
    content = "",
    onChange,
    placeholder = "Write your story...",
    className,
}: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false, // Required for SSR/Next.js
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-accent-human hover:underline",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full my-4",
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-editor-empty",
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px]",
                    "prose-headings:text-text-primary prose-p:text-text-primary",
                    "prose-strong:text-text-primary prose-code:text-accent-ai",
                    "prose-blockquote:border-accent-human prose-blockquote:text-text-secondary",
                    "prose-pre:bg-bg-tertiary prose-pre:text-text-primary"
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    if (!editor) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-bg-tertiary bg-bg-secondary">
                <p className="text-text-secondary">Loading editor...</p>
            </div>
        );
    }

    const ToolbarButton = ({
        onClick,
        isActive,
        children,
        title,
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                "rounded p-2 transition-colors hover:bg-bg-tertiary",
                isActive && "bg-bg-tertiary text-accent-human"
            )}
        >
            {children}
        </button>
    );

    const addLink = () => {
        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className={cn("rounded-lg border border-bg-tertiary bg-bg-secondary", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-bg-tertiary p-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-6 w-px bg-bg-tertiary" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-6 w-px bg-bg-tertiary" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    title="Code Block"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-6 w-px bg-bg-tertiary" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <div className="mx-1 h-6 w-px bg-bg-tertiary" />

                <ToolbarButton onClick={addLink} title="Add Link">
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton onClick={addImage} title="Add Image">
                    <ImageIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Divider"
                >
                    <Minus className="h-4 w-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>

            {/* Editor Styles */}
            <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--text-tertiary);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
        </div>
    );
}
