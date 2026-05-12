import { useEffect } from "react";
import { styled } from '@linaria/react'
import { useLocalProxy } from "@/store";

const Title = styled.div`
  padding: 3px 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Caret = styled.div<{ $open: boolean }>`
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #ccc;
  width: 0px;
  margin-left: 10px;
  transform: rotate(${props => props.$open ? 0 : '90deg'})
`
const Panel = styled.div`
    position: absolute;
    border: 1px solid #bbb;
    min-width: 100px;
    border-radius: 5px;
    margin-top: 5px;
    background-color: white;
    z-index: 2;
`
const Option = styled.div`
  padding: 3px 8px;
  font-size: 14px;
`

export default function Select({ value, items, onChange }: any) {
  const [localState, localStore] = useLocalProxy({
    open: false,
    title: '无'
  });
  useEffect(() => {
    const item = items.find((it: any) => it.value === value);
    if (item) {
      localStore.title = item.title;
    }
  }, [items, value])
  return (
    <div style={{ position: 'relative', fontSize: 14 }}>
      <Title onClick={() => {
        localStore.open = !localStore.open;
      }}>
        {localState.title}
        <Caret $open={localState.open} />
      </Title>
      {localState.open && <Panel>
        {items.map((it: any) => (<Option onClick={() => {
          if (onChange) {
            onChange(it.value)
          }
          localStore.open = false;
        }}>{it.title}</Option>))}
      </Panel>}
    </div>
  )
}