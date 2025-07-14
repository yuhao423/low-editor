
import type { CommonComponentProps } from '@/editor/interface';
import { useMaterialDrop } from '@/editor/hooks/useMaterialDrop';



export const Container = ({ id, children, style }: CommonComponentProps) => {

    const { drop } = useMaterialDrop(['Button', 'Container'], id)
    return (
        <div
            style={style}
            data-component-id={id}
            ref={drop}
            className='border-[1px] border-[#000] min-h-[100px] p-[20px]'
        >{children}</div>
    )
}
