import { useRef, useState } from "react"

import { Check, Home, MoreHorizontal, Plus } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar"
import { useEditorStore } from "@/editor/stores/useEditorStore"

export const PageTabs = () => {
  const { pages, currentPageId, setCurrentPage, addPage } = useEditorStore()
  const pageNameRef = useRef(1)
  const [mainPageId, setMainPageId] = useState(pages[0]?.id || null)

  const handleAddPage = () => {
    addPage("页面" + pageNameRef.current++)
  }

  const handleEditPage = (id: string) => {
    console.log("Edit page:", id)
  }

  const handleDeletePage = (id: string) => {
    console.log("Delete page:", id)
  }

  const handleSetAsMain = (id: string) => {
    setMainPageId(id)
  }

  // 将主页面放到第一位
  const sortedPages = [...pages].sort((a, b) => {
    if (a.id === mainPageId) return -1
    if (b.id === mainPageId) return 1
    return 0
  })

  return (
    <div className="p-2 border-b border-slate-200 max-h-[200px] min-h-[200px] overflow-y-auto">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <div className="flex justify-between items-center w-full px-2 text-base font-semibold">
            <span className="text-sm">页面</span>
            <SidebarGroupAction title="添加页面" onClick={handleAddPage}>
              <Plus className="w-10 h-10 text-black" />
            </SidebarGroupAction>
          </div>
        </SidebarGroupLabel>

        <SidebarGroupContent className="flex flex-col gap-2 mt-2">
          {sortedPages.map((page) => {
            const isActive = page.id === currentPageId
            const isMain = page.id === mainPageId

            return (
              <div
                key={page.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${isActive ? "bg-[#edeefd]" : "bg-transparent"}`}
                onClick={() => setCurrentPage(page.id)}
              >
                <div className="flex items-center gap-2">
                  {isMain && <Home className={`w-4 h-4 ${isActive ? "text-[#4352f4]" : "text-[#97a0f9]"}`} />}
                  {isActive && <Check className="w-4 h-4 text-[#4352f4]" />}
                  <span className={`font-medium ${isActive ? "text-[#4352f4]" : "text-gray-800"}`}>{page.name}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* <button className="opacity-70 group-hover:opacity-100 text-sm px-1">...</button> */}
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left" align="start">
                    <DropdownMenuItem onClick={() => handleEditPage(page.id)}>编辑</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeletePage(page.id)}>删除</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSetAsMain(page.id)}>设为主页面</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  )
}
