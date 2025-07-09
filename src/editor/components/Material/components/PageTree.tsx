interface TreeNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  children?: TreeNode[];
}
import { useState } from "react";
import { cn } from "@/lib/utils"; // shadcn 的 className 合并工具
import { ChevronDown, ChevronRight, Image, Grid3X3, FileText, Square } from "lucide-react";

interface TreeNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  children?: TreeNode[];
}

interface TreeItemProps {
  node: TreeNode;
  level?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export const TreeItem = ({ node, level = 0, selectedId, onSelect }: TreeItemProps) => {
  const [expanded, setExpanded] = useState(true);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="pl-2">
      <div
        className={cn(
          "flex items-center space-x-1 py-1 px-2 rounded-md cursor-pointer hover:bg-muted",
          selectedId === node.id && "bg-primary text-white"
        )}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect?.(node.id);
        }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        ) : (
          <span className="w-4" /> // 空位对齐
        )}
        {node.icon}
        <span className="text-sm">{node.name}</span>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
const exampleTree: TreeNode = {
  id: "root",
  name: "推荐商品绢带",
  icon: <Image size={16} />,
  children: [
    {
      id: "1",
      name: "网格容器1",
      icon: <Grid3X3 size={16} />,
      children: [
        {
          id: "2",
          name: "网格容器2",
          icon: <Grid3X3 size={16} />,
          children: [
            { id: "img1", name: "图片1", icon: <Image size={16} /> },
            { id: "text1", name: "富文本1", icon: <FileText size={16} /> },
            { id: "btn1", name: "按钮1", icon: <Square size={16} /> },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "网格容器3",
      icon: <Grid3X3 size={16} />,
    },
    // 网格容器4 - 10 略
  ],
};

export default function PageTree() {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  return (
    <div className="p-2 w-64">
      <TreeItem
        node={exampleTree}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  );
}

