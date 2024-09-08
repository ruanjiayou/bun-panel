import { ReactComponent as add } from '../../assets/add.svg'
import { ReactComponent as del } from '../../assets/delete.svg'
import { ReactComponent as edit } from '../../assets/edit.svg'
import { ReactComponent as wan } from '../../assets/wan.svg'
import { ReactComponent as lan } from '../../assets/lan.svg'
import { ReactComponent as menu } from '../../assets/menu.svg'
import { ReactComponent as search } from '../../assets/search.svg'
import { Observer } from 'mobx-react-lite'
import styled from 'styled-components'

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
}
export default function Icon({ type, size = 20, cursor = 'pointer', color = 'white', ...props }) {
  const Image = types[type];
  return <Observer>{() => (Image && <Center>
    <Image style={{ width: size, height: size, cursor, fill: color }} {...props} />
  </Center>)}</Observer>
}