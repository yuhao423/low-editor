import { useDrag } from 'react-dnd'
export interface MaterialItemProps {
  name: string
  desc: string
}

export function MaterialItem(props: MaterialItemProps) {
  const { name, desc } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
      desc,
    },
  })

  return (
    <li ref={drag as unknown as React.Ref<HTMLLIElement>} className="cursor-move rounded bg-white p-2 shadow hover:bg-[#ccc]">
      {desc}
    </li>
  )
}
