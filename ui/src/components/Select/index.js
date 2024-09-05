import { Observer, useLocalStore } from "mobx-react-lite";
import { useEffect } from "react";
import styled from "styled-components";

const Title = styled.div`
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const Caret = styled.div`
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 10px solid #ccc;
  width: 0px;
  margin-left: 10px;
  transform: rotate(${props => props.open ? 0 : '90deg'})
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
  padding: 5px;
`

export default function Select({ value, items, onChange }) {
  const local = useLocalStore(() => ({
    open: false,
    title: '无'
  }));
  useEffect(() => {
    const item = items.find(it => it.value === value);
    if (item) {
      local.title = item.title;
    }
  }, [items, value])
  return <Observer>{() => (
    <div style={{ position: 'relative' }}>
      <Title onClick={() => {
        local.open = !local.open;
      }}>
        {local.title}
        <Caret open={local.open} />
      </Title>
      {local.open && <Panel>
        {items.map(it => (<Option onClick={() => {
          if (onChange) {
            onChange(it.value)
          }
          local.open = false;
        }}>{it.title}</Option>))}
      </Panel>}
    </div>
  )}</Observer>
}