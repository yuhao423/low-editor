import { Actions } from "./components/Actions"
import { Property } from "./components/Property"
import { Styles } from "./components/Styles"

/** todo 页面的话还得有布局 */
export const Setting = () => {
  return (
    <div>
      <Property></Property>
      <Styles></Styles>
      <Actions></Actions>
    </div>
  )
}
