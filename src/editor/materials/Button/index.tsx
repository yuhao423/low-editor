/* eslint-disable react-refresh/only-export-components */
import { Button as ExampleButton } from "@/components/ui/button";
import type { CommonComponentProps } from "@/editor/interface";


export interface ButtonProps {
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  text: string;
}

export const Button = ({ id, style, variant = 'default', text }: CommonComponentProps) => {
  
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <ExampleButton data-component-id={id} style={style} variant={variant}>{text}</ExampleButton>
    </div>
  )
}

export const meta = {
  actions: [

  ],
  setter: [
    {
      /** 字段名 */
      name: 'variant',
      label: '按钮类型',
      renderType: 'select',
      defaultBtnType: 'default',
      defaultText: '按钮',
      options: [
        { label: 'Primary', value: 'default' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Outline', value: 'outline' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Link', value: 'link' },
        { label: 'ghost', value: 'ghost' }
      ]
    },
    {
      name: 'text',
      label: '文本',
      renderType: 'input'
    }
  ],
  styleSetter:[
    {
      name:'width',
      label:'宽度',
      renderType:'inputNumber',
      defaultUnit:'px',
      unit: 'px',
      unitOptions:['px','%'],
      defaultWidth:100
    },
      {
      name:'height',
      label:'高度',
      renderType:'inputNumber',
      defaultUnit:'px',
      unit: 'px',
      unitOptions:['px','%'],
      defaultHeight:30
    },
  ]
}