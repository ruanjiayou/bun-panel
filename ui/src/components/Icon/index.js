import { ReactComponent as add } from '../../assets/add.svg'
import { ReactComponent as del } from '../../assets/delete.svg'
import { ReactComponent as edit } from '../../assets/edit.svg'
import { ReactComponent as wan } from '../../assets/wan.svg'
import { ReactComponent as lan } from '../../assets/lan.svg'
import { ReactComponent as menu } from '../../assets/menu.svg'
import { ReactComponent as search } from '../../assets/search.svg'
import { ReactComponent as view } from '../../assets/view.svg'
import { ReactComponent as voff } from '../../assets/view-off.svg'
import { ReactComponent as sort } from '../../assets/sort.svg'
import { Observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { assign, omit } from 'lodash'

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.4;
  }
`

const types = {
  add,
  del,
  edit,
  wan,
  lan,
  menu,
  search,
  view,
  voff,
  sort,
}
export default function Icon({ type, size = 20, cursor = 'pointer', color = 'white', ...props }) {
  const Image = types[type];
  return <Observer>{() => (Image && <Center>
    <Image style={assign({ width: size, height: size, cursor, fill: color }, props.style || {})} {...omit(props, ['style'])} />
  </Center>)}</Observer>
}