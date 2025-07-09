import { Button as ExampleButton } from "@/components/ui/button";
import type { CommonComponentProps } from "@/editor/interface";


export interface ButtonProps {
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  text: string;
}

const Button = ({ id, variant = 'default', text }: CommonComponentProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <ExampleButton data-component-id={id} variant={variant}>{text}</ExampleButton>
    </div>
  )
}

export default Button;