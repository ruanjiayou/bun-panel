import { styled } from '@linaria/react'
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
  &.disabled {
    opacity: 0.5;
  }
`
const Handler = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 15px;
  background-color: #ddd;
`

export default function Switch({ disabled = false, checked, onSwitch, children }: { disabled?: boolean, checked: any, onSwitch: (checked: boolean) => void, children: any }) {
  return (
    <Container>
      <FullWidth>
        <Wrap className={disabled ? 'disabled' : ''} style={{ backgroundColor: checked ? '#39c' : '#fff', borderColor: checked ? '#39c' : '#bbb', justifyContent: checked ? 'flex-start' : 'flex-end' }} onClick={() => {
          if (onSwitch && !disabled) {
            onSwitch(!checked);
          }
        }}>
          <Handler />
        </Wrap>
        {children}
      </FullWidth>
    </Container >
  )
}