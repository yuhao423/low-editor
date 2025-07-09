import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import { Header } from "./components/Header";
import { EditArea } from "./components/EditArea";
import { Setting } from "./components/Setting";
import { Material } from "./components/Material/index";


export default function LowCodeEditor() {
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-[24px] overflow-hidden shadow-md">
      <div className="h-[60px] flex items-center border-b border-[#00000020] px-4 shrink-0">
        <Header />
      </div>
      <div className="flex-1">
        <Allotment defaultSizes={[240, 1, 300]} className="h-full">
          <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
            <Material />
          </Allotment.Pane>
          <Allotment.Pane>
            <EditArea />
          </Allotment.Pane>
          <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
            <Setting />
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
}