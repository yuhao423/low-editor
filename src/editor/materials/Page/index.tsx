


import type { CommonComponentProps } from '@/editor/interface';
import { useMaterialDrop } from "@/editor/hooks/useMaterialDrop";

function Page({ id, children }: CommonComponentProps) {
    
    const {drop,canDrop} = useMaterialDrop(['Button','Container'],id)

    return (
        <div
            data-component-id={id}
            ref={drop}
            className='p-[20px] box-border min-h-full w-full'
            style={{ border: canDrop ? '1px solid #4652f2' : 'none' }}
        >
            {children}
        </div>
    )
}

export default Page;
