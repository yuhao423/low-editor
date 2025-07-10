
import React from 'react'
import LowCodeEditor from './editor'
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="bg-[#ebebeb] w-screen h-screen overflow-hidden p-4 box-border">
      <Toaster richColors position='top-center' />
      <LowCodeEditor />
    </div>
  )
}

export default App
