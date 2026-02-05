"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Code,
    Image as ImageIcon,
    Link as LinkIcon,
    Quote
} from 'lucide-react';
import { Card } from "@/components/ui/Card";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
    onChange: (json: any, html: string) => void;
}

export function TiptapEditor({ onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Image,
            Link.configure({
                openOnClick: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON(), editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] text-lg lg:text-xl text-zinc-300',
            },
        },
    });

    if (!editor) return null;

    const MenuButton = ({ onClick, isActive, children, title }: any) => (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:bg-zinc-800'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="space-y-4">
            <Card className="p-1 border-white/10 bg-black/40 backdrop-blur-md sticky top-24 z-10 flex flex-wrap gap-1">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic size={18} />
                </MenuButton>
                <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered size={18} />
                </MenuButton>
                <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    <Quote size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    <Code size={18} />
                </MenuButton>
                <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                <MenuButton
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    isActive={editor.isActive('link')}
                    title="Insert Link"
                >
                    <LinkIcon size={18} />
                </MenuButton>
                <MenuButton
                    onClick={() => {
                        const url = window.prompt('Image URL');
                        if (url) editor.chain().focus().setImage({ src: url }).run();
                    }}
                    title="Insert Image"
                >
                    <ImageIcon size={18} />
                </MenuButton>
            </Card>

            <EditorContent editor={editor} />
        </div>
    );
}
