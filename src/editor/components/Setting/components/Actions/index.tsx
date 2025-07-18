import { Info } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type PageSettings = {
  name: string
  path: string
  rollCodeMode: boolean
}

export const Actions = () => {
  const form = useForm<PageSettings>({
    defaultValues: {
      name: "大促",
      path: "index",
      rollCodeMode: false,
    },
  })

  const onSubmit = (values: PageSettings) => {
    console.log("页面设置", values)
  }

  return (
    <div className="p-4 space-y-6 border-b">
      <h2 className="text-sm font-medium text-muted-foreground">Actions</h2>
      <Form {...form}>
        <form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名称</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入页面名称" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>路径</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="opacity-70 cursor-not-allowed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">视图</div>
            <Button variant="ghost" size="icon">
              +
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">弹窗</div>
            <Button variant="ghost" size="icon">
              +
            </Button>
          </div>

          <FormField
            control={form.control}
            name="rollCodeMode"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <FormLabel className="text-sm">RollCode模式</FormLabel>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
