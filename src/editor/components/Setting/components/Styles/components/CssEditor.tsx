import MonacoEditor, { type OnMount } from "@monaco-editor/react"
import type { editor } from "monaco-editor"

import type { CustomCssDialogProps } from "./CustomCssDialog"

export interface EditorFile {
  name: string
  value: string
  language: string
}

export interface Props extends CustomCssDialogProps {
  //   value: string
  //   onChange?: (value: string, ev: editor.IModelContentChangedEvent) => void
  options?: editor.IStandaloneEditorConstructionOptions
  height?: string | number
}

export default function CssEditor(props: Props) {
  const { value, onChange, options, height = 400 } = props

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run()
    })
  }

  const handleChange = (value: string | undefined, ev: editor.IModelContentChangedEvent) => {
    if (onChange) {
      onChange(value ?? "", ev)
    }
  }

  return (
    <MonacoEditor
      height={height}
      path="component.css"
      language="css"
      onMount={handleEditorMount}
      onChange={handleChange}
      value={value}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options,
      }}
    />
  )
}
