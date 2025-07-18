import { Toaster } from "@/components/ui/sonner"

import LowCodeEditor from "./editor"

function App() {
  return (
    <div className="box-border h-screen w-screen overflow-hidden bg-[#ebebeb] p-4">
      <Toaster richColors position="top-center" />
      <LowCodeEditor />
    </div>
  )
}

export default App
