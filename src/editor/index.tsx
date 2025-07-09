import { useState } from "react";
import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import { Header } from "./components/Header";
import { EditArea } from "@/editor/components/EditArea/index";
import { MaterialComponentsList } from '@/editor/materials/index'
import { Setting } from "./components/Setting";
import { Material } from "./components/Material/index";
import { X } from "lucide-react"; // 使用 lucide-react 图标

export default function LowCodeEditor() {
    const [showComponentList, setShowComponentList] = useState(true);

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-md">
            <div className="h-[60px] flex items-center border-b border-[#00000020] px-4 shrink-0">
                <Header />
            </div>
            <div className="flex-1">
                <Allotment
                    defaultSizes={showComponentList ? [240, 400, 1, 300] : [240, 1, 300]}
                    className="h-full"
                >
                    {/* 左侧物料区 */}
                    <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
                        <Material />
                    </Allotment.Pane>

                    {/* 可关闭的组件列表区 */}
                    {showComponentList && (
                        <Allotment.Pane preferredSize={400} minSize={400} maxSize={400}>
                            <div className="relative h-full bg-gray-50 border-l border-r border-[#00000010]">
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                                    onClick={() => setShowComponentList(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <MaterialComponentsList></MaterialComponentsList>
                            </div>
                        </Allotment.Pane>
                    )}

                    {/* 中间画布 */}
                    <Allotment.Pane>
                        <EditArea />
                    </Allotment.Pane>

                    {/* 右侧设置面板 */}
                    <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
                        <Setting />
                    </Allotment.Pane>
                </Allotment>
            </div>

            {/* 可选：在底部或角落添加“重新打开组件列表”的按钮 */}
            {!showComponentList && (
                <button
                    className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-sm border"
                    onClick={() => setShowComponentList(true)}
                >
                    打开组件列表
                </button>
            )}
        </div>
    );
}
