/* eslint-disable react-refresh/only-export-components */
import { Button as ExampleButton } from "@/components/ui/button";
import type { CommonComponentProps } from "@/editor/interface";


export interface ButtonProps {
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  text: string;
}

export const Button = ({ id, variant = 'default', text }: CommonComponentProps) => {
  console.log(variant,'vamntt');
  
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <ExampleButton data-component-id={id} variant={variant}>{text}</ExampleButton>
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
      defaultBtnType:'default',
      defaultText:'按钮',
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
}