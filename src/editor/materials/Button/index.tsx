import { Button as ExampleButton } from "@/components/ui/button";


export interface ButtonProps {
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    text: string;
}

const Button = ({variant = 'default', text}: ButtonProps) => {
  return (
   <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <ExampleButton variant={variant}>{text}</ExampleButton>
    </div>
  )
}

export default Button;