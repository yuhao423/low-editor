import { Plus } from "lucide-react"
import type { editor } from "monaco-editor"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import CssEditor from "./CssEditor"

export interface CustomCssDialogProps {
  value: string
  onChange: (value: string, ev: editor.IModelContentChangedEvent) => void
  handleSubmit?: (value: any) => void
  open?: boolean
  openChange?: (open: boolean) => any
}

export function CustomCssDialog(props: CustomCssDialogProps) {
  const { value, onChange, handleSubmit, open, openChange } = props

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-10">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>自定义 CSS</DialogTitle>
          <DialogDescription>你可以在这里添加自定义的 CSS 样式</DialogDescription>
        </DialogHeader>

        {/* 这里你可以放 textarea 或代码编辑器 */}
        <div>
          {/* <textarea className="h-32 w-full rounded-md border p-2 text-sm" placeholder="例如：background-color: red;" /> */}
          <CssEditor value={value} onChange={onChange} />
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
