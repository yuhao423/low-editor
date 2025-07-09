
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCanvasStore } from "@/editor/stores/useCanvasStore";
import { CommandShortcut } from "@/components/ui/command";

const zoomOptions = [
    { label: "50%", value: 0.5, shortcut: "⌘+1" },
    { label: "75%", value: 0.75, shortcut: "⌘+2" },
    { label: "100%", value: 1, shortcut: "⌘+3" },
    { label: "125%", value: 1.25, shortcut: "⌘+4" },
    { label: "150%", value: 1.5, shortcut: "⌘+5" },
    { label: "200%", value: 2, shortcut: "⌘+6" },
];

export function ZoomSelector() {
    const { scale, setScale } = useCanvasStore();

    const currentLabel = `${Math.round(scale * 100)}%`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center px-2 py-1 text-sm font-medium border rounded-md bg-white hover:bg-gray-50">
                    {currentLabel}
                    <ChevronDown className="ml-1 h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                {zoomOptions.map((opt) => (
                    <DropdownMenuItem
                        key={opt.value}
                        onClick={() => setScale(opt.value)}
                        className="flex justify-between"
                    >
                        <span>{opt.label}</span>
                        <CommandShortcut>{opt.shortcut}</CommandShortcut>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
export const Header = () => {

    return <div>Header  <ZoomSelector />
    </div>
}