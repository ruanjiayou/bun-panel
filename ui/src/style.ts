import { styled } from '@linaria/react'

export const MenuWrap = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
  background-color: #3333337d;
  padding: 0.5rem;
  border-radius: 5px;
`
export const Group = styled.div`

`
export const GroupTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  & > div {
    visibility: hidden;
  }
  &:hover > div{
    visibility: visible;
  }
`
export const CardWrap = styled.div`
  display: block;
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  row-gap: 10px;
  flex-flow: wrap;
  padding: 10px 0;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
`
export const Cell = styled.div`

`
export const Card = styled.a`
  background-color: #3333338a;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  inset: 1px;
  color: white;
  z-index: 1;
  box-sizing: border-box;
  border-radius: 9px;
  padding-right: 10px;
  text-decoration: none;
  &:hover {
    background-color: #333;
    cursor: pointer;
  }
`
export const HoverItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-radius: 3px;
  margin-bottom: 10px;
  &:hover {
    background-color: #eee;
  }
`
export const AppIcon = styled.img`
  width: 2.6rem;
  height: 2.6rem;
  margin: 0 1rem 0 10px;
  border-radius: 1rem;
`
export const AppTitle = styled.div`
  font-size: 16px;
`
export const AppDesc = styled.div`
  font-size: 14px;
  color: #888;
`