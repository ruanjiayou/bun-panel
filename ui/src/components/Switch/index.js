import { Observer } from "mobx-react-lite";
import styled from "styled-components";
import { FullWidth } from "../style.js";

const Container = styled.span`
  display: inline-block;
  font-size: 14px;
`
const Wrap = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 40px;
  border: 1px solid #bbb;
  border-radius: 15px;
  margin-right: 10px;
`
const Handler = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 15px;
  background-color: #ddd;
`

export default function Switch({ checked, onSwitch, children }) {
  return <Observer>{() => (
    <Container>
      <FullWidth>
        <Wrap style={{ backgroundColor: checked ? '#39c' : '#fff', borderColor: checked ? '#39c' : '#bbb', justifyContent: checked ? 'flex-start' : 'flex-end' }} onClick={() => {
          if (onSwitch) {
            onSwitch(!checked);
          }
        }}>
          <Handler />
        </Wrap>
        {children}
      </FullWidth>
    </Container>
  )}</Observer>
}