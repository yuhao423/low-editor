import { PageTabs } from "./components/PageTabs"
import PageTree from "./components/PageTree"

export const Material = () => {
  return (
    <div className="w-full h-full flex flex-col bg-white border-r">
      <PageTabs />
      <div className="flex-1 overflow-auto">
        <PageTree></PageTree>
      </div>
    </div>
  )
}
