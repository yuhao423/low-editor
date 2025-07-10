import { useDrag } from "react-dnd";
export interface MaterialItemProps {
    name: string
}

export function MaterialItem(props: MaterialItemProps) {

    const {
        name
    } = props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name
        }
    });

    return <li ref={drag as unknown as React.Ref<HTMLLIElement>} className="p-2 bg-white rounded shadow  hover:bg-[#ccc] cursor-move">{name}</li>
}
