"use client"

import { useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"

type RichTextToolbarProps = {
  editor: Editor | null
}

const buttonStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "8px 10px",
  background: "#ffffff",
  color: "#334155",
  fontWeight: 700,
  cursor: "pointer",
}

const activeButtonStyle = {
  ...buttonStyle,
  background: "#dbeafe",
  border: "1px solid #60a5fa",
  color: "#1d4ed8",
}

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    if (!editor) {
      return
    }

    const updateToolbar = () => {
      forceUpdate((value) => value + 1)
    }

    editor.on("selectionUpdate", updateToolbar)
    editor.on("transaction", updateToolbar)
    editor.on("update", updateToolbar)

    return () => {
      editor.off("selectionUpdate", updateToolbar)
      editor.off("transaction", updateToolbar)
      editor.off("update", updateToolbar)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  function runCommand(command: () => void) {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      command()
      forceUpdate((value) => value + 1)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        borderBottom: "1px solid #e2e8f0",
        padding: "10px",
        background: "#f8fafc",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    >
      <button
        type="button"
        onMouseDown={runCommand(() => editor.chain().focus().toggleBold().run())}
        style={editor.isActive("bold") ? activeButtonStyle : buttonStyle}
      >
        B
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() =>
          editor.chain().focus().toggleItalic().run()
        )}
        style={editor.isActive("italic") ? activeButtonStyle : buttonStyle}
      >
        I
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() =>
          editor.chain().focus().toggleUnderline().run()
        )}
        style={editor.isActive("underline") ? activeButtonStyle : buttonStyle}
      >
        U
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() =>
          editor.chain().focus().toggleBulletList().run()
        )}
        style={editor.isActive("bulletList") ? activeButtonStyle : buttonStyle}
      >
        • List
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() =>
          editor.chain().focus().toggleOrderedList().run()
        )}
        style={editor.isActive("orderedList") ? activeButtonStyle : buttonStyle}
      >
        1. List
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() =>
          editor.chain().focus().toggleHighlight().run()
        )}
        style={editor.isActive("highlight") ? activeButtonStyle : buttonStyle}
      >
        Highlight
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() => editor.chain().focus().undo().run())}
        disabled={!editor.can().undo()}
        style={{
          ...buttonStyle,
          opacity: editor.can().undo() ? 1 : 0.5,
          cursor: editor.can().undo() ? "pointer" : "not-allowed",
        }}
      >
        Undo
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() => editor.chain().focus().redo().run())}
        disabled={!editor.can().redo()}
        style={{
          ...buttonStyle,
          opacity: editor.can().redo() ? 1 : 0.5,
          cursor: editor.can().redo() ? "pointer" : "not-allowed",
        }}
      >
        Redo
      </button>

      <button
        type="button"
        onMouseDown={runCommand(() =>
          alert("AI rewrite selection will be connected in a future phase.")
        )}
        style={{
          ...buttonStyle,
          background: "#eff6ff",
          color: "#1d4ed8",
        }}
      >
        AI Rewrite
      </button>
    </div>
  )
}