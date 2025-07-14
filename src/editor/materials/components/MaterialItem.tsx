import { useDrag } from "react-dnd";
export interface MaterialItemProps {
    name: string
    desc: string
}

export function MaterialItem(props: MaterialItemProps) {

    const {
        name,
        desc
    } = props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            desc
        }
    });

    return <li ref={drag as unknown as React.Ref<HTMLLIElement>} className="p-2 bg-white rounded shadow  hover:bg-[#ccc] cursor-move">{desc}</li>
}
