import { useEffect } from 'react'
import { useEditorStore } from '@/editor/stores/useEditorStore'



export const EditArea = () => {

    const { components, addComponent } = useEditorStore()


    useEffect(() => {
        addComponent({
            id: Date.now().toString(),
            name: 'yu',
            type: 'Display',
            props: {},

        }, '1')
    }, [])
    console.log(components);

    return <div className="p-4 bg-gray-100 rounded-md shadow-inner">
        <h3 className="text-lg font-semibold mb-2">组件树 JSON 结构</h3>
        <pre className="text-sm bg-white p-4 rounded overflow-auto max-h-[500px]">
            {JSON.stringify(components, null, 2)}
        </pre>
    </div>
}