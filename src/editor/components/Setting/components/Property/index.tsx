import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useComponentConfigStore, type ComponentSetter } from "@/editor/stores/componentsConfig";
import { useEditorStore } from "@/editor/stores/useEditorStore";
import { useEffect } from "react";

export const Property = () => {
    const { currentComponentId, updateComponent, currentComponent } = useEditorStore();
    const { componentConfig } = useComponentConfigStore();
    const componentName = currentComponent?.name;
    const config = componentName ? componentConfig[componentName] : null;
    const setters = config?.setter ?? [];

    // 初始化时用 defaultProps 填充，避免 undefined
    const initialDefaultValues = currentComponent?.props || config?.defaultProps || {};
    console.log(initialDefaultValues,'323');
    
    const form = useForm({
        defaultValues: initialDefaultValues,
    });

    // 监听 currentComponent 变化，同步更新表单值
    useEffect(() => {
        if (currentComponent?.props) {
            form.reset({ ...config?.defaultProps, ...currentComponent.props });
        } else if (config?.defaultProps) {
            form.reset(config.defaultProps);
        }
    }, [currentComponent, config]);

    const onSubmit = (values: any) => {
        if (currentComponentId) {
            updateComponent(currentComponentId, values);
        }
    };

    if (!currentComponent || !setters.length) return null;

    function renderFormElement(setting: ComponentSetter, field: any) {
        const { renderType, options } = setting;

        if (renderType === "select") {
            return (
                <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {options?.map((opt: any) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        } else if (renderType === "input") {
            return <Input {...field} />;
        }

        // fallback
        return <Input {...field} />;
    }

    return (
        <div className="p-4 space-y-6 border-b">
            <h2 className="text-sm font-medium text-muted-foreground">{componentName} 属性</h2>

            <Form {...form}>
                <form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
                    {setters.map((item) => (
                        <FormField
                            key={item.name}
                            control={form.control}
                            name={item.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{item.label}</FormLabel>
                                    <FormControl>{renderFormElement(item, field)}</FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </form>
            </Form>
        </div>
    );
};
