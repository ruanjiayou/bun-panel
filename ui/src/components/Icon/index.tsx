import add from '../../assets/add.svg?react'
import del from '../../assets/delete.svg?react'
import edit from '../../assets/edit.svg?react'
import wan from '../../assets/wan.svg?react'
import lan from '../../assets/lan.svg?react'
import menu from '../../assets/menu.svg?react'
import setting from '../../assets/setting.svg?react'
import local from '../../assets/local.svg?react'
import network from '../../assets/network.svg?react'
import allow_mix from '../../assets/allow-mix.svg?react'
import not_allow_mix from '../../assets/not-allow-mix.svg?react'
import search from '../../assets/search.svg?react'
import view from '../../assets/view.svg?react'
import voff from '../../assets/view-off.svg?react'
import sort from '../../assets/sort.svg?react'
import { styled } from '@linaria/react'
import { assign, omit } from 'lodash'

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.4;
  }
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
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
  setting,
  local,
  network,
  allow_mix,
  not_allow_mix
}
export default function Icon({ type, size = 20, color = 'white', disabled = false, ...props }: any) {
  const Image = types[type as keyof typeof types];
  return (Image && <Center className={disabled ? 'disabled' : ''}>
    <Image style={assign({ width: size, height: size, fill: color }, props.style || {})} {...omit(props, ['style'])} />
  </Center>)
}