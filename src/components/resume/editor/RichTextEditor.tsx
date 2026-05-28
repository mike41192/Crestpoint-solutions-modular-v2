"use client"

import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { RichTextToolbar } from "@/components/resume/editor/RichTextToolbar"

type RichTextEditorProps = {
  value: string
  placeholder?: string
  minHeight?: string
  onChange: (value: string) => void
}

export function RichTextEditor({
  value,
  placeholder = "Start writing...",
  minHeight = "160px",
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: `
          min-height: ${minHeight};
          padding: 14px;
          outline: none;
          line-height: 1.6;
          color: #0f172a;
        `,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  return (
    <div
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <RichTextToolbar editor={editor} />

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror p {
          margin: 0 0 8px;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 24px;
          margin: 8px 0;
        }

        .ProseMirror li {
          margin-bottom: 6px;
        }

        .ProseMirror mark {
          background: #fef3c7;
          border-radius: 4px;
          padding: 0 2px;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #94a3b8;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}